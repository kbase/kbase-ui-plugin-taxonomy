import * as props from '../views/taxon/lib/props';

export interface WikipediaInfo {
    imageUrl: string;
    pageUrl: string;
    introText: string;
    title: string;
    pageId: number;
    exactMatch: boolean;
    matchingTerms: Array<string>;
}

// interface WikipediaParse {
//     headhtml: Map<string, string>;
//     pageid: number;
//     redirects: Array<string>;
//     text: Map<string, string>;
//     title: string;
// }

class NotFound extends Error {
    constructor(message: string) {
        super(message);

        this.name = 'NotFound';
    }
}

interface GetPageResponse { wikiResponse: any; matchingTerms: Array<string>; exactMatch: boolean; }

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';
const IMAGE_SIZE = 500;

export default class WikipediaClient {
    scrubTerm(proposedTerm: string): string {
        // conservatively, remove all non-alpha characters
        const chars = proposedTerm.split('');
        const validChar = /[\w \s]/;
        const newChars = chars.filter((char) => {
            if (validChar.exec(char)) {
                return true;
            }
            return false;
        });
        return newChars.join('');
    }

    async findTerm(term: string): Promise<WikipediaInfo> {
        if (!term) {
            throw new Error('Empty term passed');
        }
        const lookupTerm = this.scrubTerm(term);
        const info = await this.getWikipediaInfo(lookupTerm);

        const introText = info.introText
            .replace(/====/g, '####')
            .replace(/===/g, '###')
            .replace(/==/g, '##')
            .replace(/\n/g, '  \n');

        return { ...info, introText };
    }

    async getWikipediaInfo(term: string): Promise<WikipediaInfo> {
        const {
            wikiResponse: {
                parse: {
                    pageid, title
                }
            },
            matchingTerms,
            exactMatch
        } = await this.getPage(term);

        const [imageUrl, pageInfo] = await Promise.all([
            this.getImage({ size: IMAGE_SIZE, pageId: pageid }),
            this.getPageInfo({ pageId: pageid })
        ]);

        return {
            imageUrl,
            pageUrl: pageInfo.url,
            introText: pageInfo.introText,
            title,
            pageId: pageid,
            matchingTerms,
            exactMatch
        };
    }

    // see: https://www.mediawiki.org/wiki/API:Main_page
    // https://en.wikipedia.org/w/api.php?action=help&modules=parse
    async getPage(term: string): Promise<GetPageResponse> {
        const terms = term.split(/\s+/);
        let exactMatch = true;
        // We use an internal function since we may need to recursively call 
        // the fetch if there is no match found for the set of terms.
        async function fetchPage(terms: Array<string>): Promise<GetPageResponse> {
            if (terms.length === 0) {
                throw new NotFound(`No Wikipedia page found matching ${term}`);
            }
            const apiUrl = new URL(WIKIPEDIA_API_URL);
            const query = apiUrl.searchParams;
            query.set('action', 'parse');
            query.set('format', 'json');
            query.set('prop', 'text|headhtml');
            query.set('section', '0');
            query.set('redirects', '');
            query.set('page', terms.join(' '));
            const headers = {
                accept: 'application/json'
            };
            // must set this to enable cors
            query.set('origin', '*');
            const result = await fetch(apiUrl.toString(), {
                method: 'GET',
                headers
            });
            switch (result.status) {
                case 200:
                    const wikiResponse = await (() => {
                        try {
                            return result.json();
                        } catch (ex) {
                            throw new Error('Error parsing wikipedia response: ' + ex.message);
                        }
                    })();
                    if (wikiResponse.error) {
                        if (wikiResponse.error.code === 'missingtitle') {
                            terms.pop();
                            exactMatch = false;
                            return await fetchPage(terms);
                        } else {
                            console.error('wikipedia api error', wikiResponse);
                            throw new Error('Wikipedia api error: ' + wikiResponse.error.code);
                        }
                    } else {
                        return {
                            wikiResponse,
                            matchingTerms: terms,
                            exactMatch
                        };
                    }
                default:
                    const message = 'Unexpected response from wikipedia api: ' + result.status;
                    console.error(message, result);
                    throw new Error(message);
            }
        };
        return await fetchPage(terms);
    }

    async getPageInfo({ pageId }: { pageId: string; }): Promise<any> {
        const apiURL = new URL(WIKIPEDIA_API_URL);
        const query = apiURL.searchParams;
        query.set('action', 'query');
        query.set('pageids', pageId);
        query.set('prop', 'info|extracts');
        query.set('explaintext', 'true');
        query.set('inprop', 'url');
        query.set('origin', '*');
        query.set('format', 'json');

        const result = await fetch(apiURL.toString(), {
            method: 'GET'
        });
        switch (result.status) {
            case 200:
                try {
                    const wikiResponse = await result.json();
                    return {
                        url: props.getProp<string>(
                            wikiResponse,
                            ['query', 'pages', String(pageId), 'fullurl'],
                            null
                        ),
                        introText: props.getProp<string>(
                            wikiResponse,
                            ['query', 'pages', String(pageId), 'extract'],
                            null
                        )
                    };
                } catch (ex) {
                    console.error('error getting page info', ex.message);
                    throw ex;
                }
            default:
                const message = `Unexpected response from wikipedia api: ${result.status}`;
                console.error(message, result);
                throw new Error(message);
        }
    }

    async getImage({ size, pageId }: { size: number; pageId: number; }): Promise<string> {
        const apiURL = new URL(WIKIPEDIA_API_URL);
        const query = apiURL.searchParams;
        query.set('action', 'query');
        query.set('format', 'json');
        query.set('prop', 'pageimages');
        query.set('pithumbsize', String(size));
        query.set('pageids', String(pageId));
        query.set('origin', '*');
        const headers = {
            accept: 'application/json'
        };

        const result = await (() => {
            try {
                return fetch(apiURL.toString(), {
                    method: 'GET',
                    headers
                });
            } catch (err) {
                const message = `Error getting image from wikipedia: ${err.message}`;
                console.error(message, err);
                throw new Error(message);
            }
        })();

        switch (result.status) {
            case 200:
                try {
                    const wikiResponse = await result.json();
                    return props.getProp<string>(
                        wikiResponse,
                        ['query', 'pages', String(pageId), 'thumbnail', 'source'],
                        null
                    );
                } catch (ex) {
                    throw new Error('Error parsing wikipedia response: ' + ex.message);
                }
            default:
                var message = 'Unexpected response from wikipedia api: ' + result.status;
                console.error(message, result);
                throw new Error(message);
        }
    }
}
