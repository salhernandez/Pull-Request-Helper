const ckeditor5URL = 'https://cdnjs.cloudflare.com/ajax/libs/ckeditor5/40.0.0/ckeditor.min.js';
const editorID = 'PRHELPER-editor';

StringToEmoji(document);
loadJS(ckeditor5URL, yourCodeToBeCalled, document.body);


function loadJS(url, implementationCode, location){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to 
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

function yourCodeToBeCalled(e){

    // Open Editor
    var s = document.createElement('script');
    s.text = 
    `
    ClassicEditor
        .create( document.querySelector( '#${editorID}' ) )
        .catch( error => {
            console.error( error );
        } );
    `
    document.getElementsByTagName('head')[0].appendChild(s);
}

function StringToEmoji(document_root) {    

    const reviewThread = document_root.querySelectorAll('[id^=review-thread-or-comment]')[0];
    const wrapperDiv = document_root.createElement('div');
    wrapperDiv.className = "derp";

    const editorContainer = document_root.createElement('div');
    editorContainer.style.width = `${reviewThread.offsetWidth.toString()}px`;
    editorContainer.style.height = `${reviewThread.offsetHeight.toString()}px`;
    editorContainer.style.backgroundColor = 'red';
    editorContainer.id = editorID;
    
    reviewThread.after(wrapperDiv);
    wrapperDiv.append(reviewThread);
    wrapperDiv.append(editorContainer);

}


chrome.runtime.sendMessage({
    action: "getSource",
    source: "test"
});