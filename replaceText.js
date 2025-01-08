const editorID = 'PRHELPER-editor';

// Sometimes the data doesn't load because the libraries do not load!

// const schema = {
    //     id: "string",
    //     type: "thread-comment" | "review-comment",
    //     blocks: [],
    //     domNode: ...,
    //     editorID: ...
    // }

var reviewThreads = [];

addListenerToSaveUpdatedData();

setEditorDivs(document);

cirosantilli_load_scripts.loaded = new Set();


(async () => {
    await cirosantilli_load_scripts([
        'https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest',
        'https://cdn.jsdelivr.net/npm/@editorjs/header@2.7.0/dist/bundle.min.js',
        'https://cdn.jsdelivr.net/npm/@editorjs/table@2.2.2/dist/table.min.js',
        'https://cdn.jsdelivr.net/npm/@editorjs/delimiter@1.3.0/dist/bundle.min.js',
        'https://cdn.jsdelivr.net/npm/@editorjs/text-variant-tune@1.0.1/dist/text-variant-tune.min.js',
        'https://cdn.jsdelivr.net/npm/@editorjs/checklist@1.5.0/dist/bundle.min.js',
        'https://cdn.jsdelivr.net/npm/@editorjs/quote@2.5.0/dist/bundle.min.js',
        'https://cdn.jsdelivr.net/npm/@editorjs/underline@1.1.0/dist/bundle.min.js',
        'https://cdn.jsdelivr.net/npm/@editorjs/inline-code@1.4.0/dist/bundle.min.js',
        'https://cdn.jsdelivr.net/npm/@editorjs/marker@1.3.0/dist/bundle.min.js',
        'https://cdn.jsdelivr.net/npm/editorjs-alert@1.1.3/dist/bundle.min.js',
        'https://cdn.jsdelivr.net/npm/@calumk/editorjs-nested-checklist@1.1.0/dist/editorjs-nested-checklist.bundle.min.js',
        'https://cdn.jsdelivr.net/npm/@calumk/editorjs-codeflask@1.0.9/dist/editorjs-codeflask.bundle.min.js',
        'https://cdn.jsdelivr.net/npm/editorjs-style@3.0.3/dist/index.min.js',
        'https://cdn.jsdelivr.net/npm/@sotaproject/strikethrough@1.0.1/dist/bundle.min.js',
        'https://cdn.jsdelivr.net/npm/editorjs-text-color-plugin@2.0.4/dist/bundle.min.js',
        'https://cdn.jsdelivr.net/npm/editorjs-drag-drop@1.1.13/dist/bundle.min.js',
        'https://cdn.jsdelivr.net/npm/editorjs-undo@2.0.26/dist/bundle.min.js'
    ]);

    // Now do stuff with those scripts.
    injectScriptToWebPage();
})();

function injectScriptToWebPage() {
    let anIcon = `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`

    reviewThreads.forEach((element, index) => {
        let data = '[]'
        if (dataFromStorage) {
            if (dataFromStorage.hasOwnProperty(element.id)) {
                data = JSON.stringify(dataFromStorage[element.id].data.blocks);
            }
        }

        // Open Editor
        let s = document.createElement('script');
        let tempDiv = `PRH_${index}`
        s.text =
            `
    const ${tempDiv} = new EditorJS({
        /**
         * Previously saved data that should be rendered
         */
        data: {
            blocks: ${data}
        },
        placeholder: "Type your notes here...",
        /** 
         * Id of Element that should contain the Editor 
         */ 
        holder: '${element.editorID}',
        onReady: () => {
            new DragDrop(${tempDiv});
            new Undo({ ${tempDiv} });
        },
        onChange: (api, event) => {
            // TODO: Only save every second, add a timer!
            // Save Data
            api.saver.save()
            .then((outputData) => {
                if(outputData.blocks.length){
                    // SEND MESSAGE - 1
                    var message = {
                        "url": window.location.origin + window.location.pathname,
                        "dataToSave": outputData,
                        "id": "${element.id}"
                    };
                    var event = new CustomEvent("PassToBackground", {detail: message});
                    window.dispatchEvent(event);
                }
            }).catch((error) => {
                console.error('Saving failed: ', error)
            });
        },
        /** 
         * Available Tools list. 
         * Pass Tool's class or Settings object for each Tool you want to use 
         */ 
        tools: {
            alert: {
                class: Alert,
                inlineToolbar: true,
                config: {
                  defaultType: 'primary',
                  messagePlaceholder: 'Enter something',
                },
            },
            checklist: {
                class: Checklist,
                inlineToolbar: true,
            },
            code: {
                class: editorjsCodeflask,
            },
            Color: {
                class: window.ColorPlugin, // if load from CDN, please try: window.ColorPlugin
                config: {
                   colorCollections: ['#EC7878','#9C27B0','#673AB7','#3F51B5','#0070FF','#03A9F4','#00BCD4','#4CAF50','#8BC34A','#CDDC39', '#FFF'],
                   defaultColor: '#FF1300',
                   type: 'text', 
                   customPicker: true // add a button to allow selecting any colour  
                }     
            },
            delimiter: Delimiter,
            header: {
                class: Header, 
                inlineToolbar: ['link'], 
            },
            inlineCode: {
                class: InlineCode
            },
            Marker: {
                class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
                config: {
                   defaultColor: '#FFBF00',
                   type: 'marker',
                   icon: '${anIcon}'
                  }       
            },
            nestedchecklist : editorjsNestedChecklist,
            quote: {
                class: Quote,
            },
            strikethrough: Strikethrough,
            style: EditorJSStyle.StyleInlineTool,
            table: {
                class: Table,
            },
            textVariant: TextVariantTune,
            underline: Underline
        },
        /**
        * Apply to all the blocks
        */
        tunes: ['textVariant']
    });
    `
        document.getElementsByTagName('head')[0].appendChild(s);

    });
}

function setEditorDivs(document_root) {
    const reviewComment = document_root.querySelectorAll('[data-body-version]');
    const threadComment = document_root.querySelectorAll('[id^=review-thread-or-comment]');
    const diffFile = document_root.querySelectorAll('[data-details-container-group="file"]');

    // const schema = {
    //     id: "string",
    //     type: "thread-comment" | "review-comment",
    //     blocks: [],
    //     domNode: ...,
    //     editorID: ...
    // }

    // Get Data
    reviewComment.forEach(element => {
        reviewThreads.push({
            id: element.getAttribute('data-body-version'),
            type: "review-comment",
            blocks: [],
            domNode: element,
            editorID: `PRH-${element.getAttribute('data-body-version')}`
        });
    });

    threadComment.forEach(element => {
        reviewThreads.push({
            id: element.id,
            type: "thread-comment",
            blocks: [],
            domNode: element,
            editorID: `PRH-${element.id}`
        });
    });

    diffFile.forEach(element => {
        reviewThreads.push({
            id: element.id,
            type: "thread-comment",
            blocks: [],
            domNode: element,
            editorID: `PRH-${element.id}`
        });
    });

    // Nothing found
    if(!reviewThreads.length){
        return;
    }

    // Add Wrapper Divs to comments
    reviewThreads.forEach(element => {
        let wrapperDiv = document_root.createElement('div');
        wrapperDiv.className = `wrapper-${element.editorID}`;

        let editorContainer = document_root.createElement('div');
        editorContainer.style.width = `${element.domNode.offsetWidth.toString()}px`;
        editorContainer.style.height = `${element.domNode.offsetHeight.toString()}px`;
        editorContainer.style.maxHeight = `200px`;
        editorContainer.style.backgroundColor = 'black';
        editorContainer.style.color = 'gray';
        editorContainer.style.overflow = 'scroll';


        editorContainer.id = element.editorID;

        element.domNode.after(wrapperDiv);
        wrapperDiv.append(element.domNode);
        wrapperDiv.append(editorContainer);

    });
}

async function cirosantilli_load_scripts(script_urls) {
    function load(script_url) {
        return new Promise(function (resolve, reject) {
            if (cirosantilli_load_scripts.loaded.has(script_url)) {
                resolve();
            } else {
                var script = document.createElement('script');
                script.onload = resolve;
                script.src = script_url
                document.head.appendChild(script);
            }
        });
    }
    var promises = [];
    for (const script_url of script_urls) {
        promises.push(load(script_url));
    }
    await Promise.all(promises);
    for (const script_url of script_urls) {
        cirosantilli_load_scripts.loaded.add(script_url);
    }
}

function addListenerToSaveUpdatedData() {
    // SEND MESSAGE - 2
    //Listen for the event
    window.addEventListener("PassToBackground", function (evt) {
        //code to send message to open notification. This will eventually move into my extension logic
        chrome.runtime.sendMessage({
            type: "PRH_MESSAGE", options: {
                details: {
                    ...evt.detail,
                }
            }
        });
    }, false);
}