const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
   fixBabelImports('antd', {
     libraryDirectory: 'es',
     style: true,
   }),
   addLessLoader({
       lessOptions: {
           javascriptEnabled: true,
           modifyVars: {
               // see: https://ant.design/docs/react/customize-theme
               '@primary-color': '#1064b3',           // primary color for all components
               '@link-color': '@primary-color',                     // link color
            //    '@success-color': '#3c763',                         // success state color
            //    '@warning-color': '#fcf8e3',                         // warning state color
            //    '@error-color': '#a94442',              // error state color
               '@font-size-base': '14px',                           // major text font size
               '@heading-color': 'rgba(0,0,0,0.85)',                // heading text color
               '@text-color': 'rgba(0, 0, 0, 1.0)',                 // major text color
               '@text-color-secondary': 'rgba(0, 0, 0. 0.45)',      // secondary text color
               '@disabled-color': 'rgba(0, 0, 0, 0.25)',            // disable state color
               '@border-radius-base': '4px',                        // major border radius
               '@border-color-base': '#d9d9d9',                     // major border color
               '@box-shadow-base': '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',  // major shadow for layers
               '@border-color-split': 'hsv(0, 0, 80%)'
           }
       }
   })
);