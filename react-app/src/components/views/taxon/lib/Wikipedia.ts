import * as props from './props';

export interface WikipediaInfo {
    imageUrl: string;
    pageUrl: string;
    introText: string;
    title: string;
    pageId: number;
    exactMatch: boolean;
    matchingTerms: Array<string>;
}

interface WikipediaParse {
    headhtml: Map<string, string>;
    pageid: number;
    redirects: Array<string>;
    text: Map<string, string>;
    title: string;
}

class NotFound extends Error {
    constructor(message: string) {
        super(message);

        this.name = 'NotFound';
    }
}

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';
const IMAGE_SIZE = 500;

export default class Wikipedia {
    scrubTerm(proposedTerm: string): string {
        // convervatively, remove all non-alpha characters
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
        return this.getWikipediaInfo(lookupTerm).then(
            ({ imageUrl, pageUrl, introText, title, pageId, matchingTerms, exactMatch }) => {
                // this.imageUrl(imageUrl);
                // this.pageUrl(url);
                const fixedIntroText = introText
                    .replace(/====/g, '####')
                    .replace(/===/g, '###')
                    .replace(/==/g, '##')
                    .replace(/\n/g, '  \n');

                return { imageUrl, pageUrl, introText: fixedIntroText, title, pageId, matchingTerms, exactMatch };
            }
        );
    }

    async getWikipediaInfo(term: string): Promise<WikipediaInfo> {
        return this.getPage(term).then(
            ({
                wikiResponse,
                matchingTerms,
                exactMatch
            }: {
                wikiResponse: any;
                matchingTerms: Array<string>;
                exactMatch: boolean;
            }) => {
                // this.imageCaption(wikiResponse.parse.title);
                return Promise.all([
                    this.getImage({ size: IMAGE_SIZE, pageId: wikiResponse.parse.pageid }),
                    this.getPageInfo({ pageId: wikiResponse.parse.pageid })
                ]).then(([imageUrl, pageInfo]) => {
                    return {
                        imageUrl: imageUrl,
                        pageUrl: pageInfo.url,
                        introText: pageInfo.introText,
                        title: wikiResponse.parse.title,
                        pageId: wikiResponse.parse.pageid,
                        matchingTerms,
                        exactMatch
                    };
                });
            }
        );
    }

    // see: https://www.mediawiki.org/wiki/API:Main_page
    // https://en.wikipedia.org/w/api.php?action=help&modules=parse
    async getPage(term: string): Promise<{ wikiResponse: any; matchingTerms: Array<string>; exactMatch: boolean }> {
        const terms = term.split(/\s+/);
        let matchingTerms: Array<string>;
        let exactMatch = true;
        return new Promise((resolve, reject) => {
            const fetchPage = (terms: Array<string>) => {
                if (terms.length === 0) {
                    reject(new NotFound('No Wikipedia page found matching "' + term + '"'));
                    // resolve(null);
                }
                // const http = new HttpClient.HttpClient();
                // const header = new HttpClient.HttpHeader({
                //     accept: 'application/json'
                // });
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
                fetch(apiUrl.toString(), {
                    method: 'GET',
                    headers
                })
                    .then((result) => {
                        switch (result.status) {
                            case 200:
                                try {
                                    return result.json().then((wikiResponse) => {
                                        if (wikiResponse.error) {
                                            if (wikiResponse.error.code === 'missingtitle') {
                                                terms.pop();
                                                exactMatch = false;
                                                fetchPage(terms);
                                                return null;
                                            } else {
                                                console.error('wikipedia api error', wikiResponse);
                                                reject(new Error('Wikipedia api error: ' + wikiResponse.error.code));
                                            }
                                        } else {
                                            matchingTerms = terms;
                                            resolve({
                                                wikiResponse,
                                                matchingTerms,
                                                exactMatch
                                            });
                                        }
                                    });
                                } catch (ex) {
                                    reject(new Error('Error parsing wikipedia response: ' + ex.message));
                                }
                                break;
                            default:
                                const message = 'Unexpected response from wikipedia api: ' + result.status;
                                console.error(message, result);
                                reject(new Error(message));
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    });
            };
            fetchPage(terms);
        });
    }

    async getPageInfo({ pageId }: { pageId: string }): Promise<any> {
        const apiURL = new URL(WIKIPEDIA_API_URL);
        const query = apiURL.searchParams;
        query.set('action', 'query');
        query.set('pageids', pageId);
        query.set('prop', 'info|extracts');
        query.set('explaintext', 'true');
        query.set('inprop', 'url');
        query.set('origin', '*');
        query.set('format', 'json');

        // const http = new HttpClient.HttpClient();
        return fetch(apiURL.toString(), {
            method: 'GET'
        }).then((result) => {
            switch (result.status) {
                case 200:
                    try {
                        return result.json().then((wikiResponse) => {
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
                        });
                    } catch (ex) {
                        console.error('error getting page info', ex.message);
                        throw ex;
                    }
                default:
                    var message = 'Unexpected response from wikipedia api: ' + result.status;
                    console.error(message, result);
                    throw new Error(message);
            }
        });
    }

    async getImage({ size, pageId }: { size: number; pageId: number }): Promise<string> {
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

        return fetch(apiURL.toString(), {
            method: 'GET',
            headers
        })
            .then((result) => {
                switch (result.status) {
                    case 200:
                        try {
                            return result.json().then((wikiResponse) => {
                                return props.getProp<string>(
                                    wikiResponse,
                                    ['query', 'pages', String(pageId), 'thumbnail', 'source'],
                                    null
                                );
                            });
                        } catch (ex) {
                            throw new Error('Error parsing wikipedia response: ' + ex.message);
                        }
                    default:
                        var message = 'Unexpected response from wikipedia api: ' + result.status;
                        console.error(message, result);
                        throw new Error(message);
                }
            })
            .catch((err) => {
                const message = 'Error getting image from wikipedia: ' + err.message;
                console.error(message, err);
                throw new Error('Error getting image from wikipedia: ' + err.message);
            });
    }
}
