function StringToEmoji(document_root) {    

    const reviewThread = document_root.querySelectorAll('[id^=review-thread-or-comment]')[0];
    const wrapperDiv = document_root.createElement('div');
    wrapperDiv.className = "derp";

    const editorContainer = document_root.createElement('div');
    editorContainer.style.width = `${reviewThread.offsetWidth.toString()}px`;
    editorContainer.style.height = `${reviewThread.offsetHeight.toString()}px`;
    editorContainer.style.backgroundColor = 'red';


    reviewThread.after(wrapperDiv);
    wrapperDiv.append(reviewThread);
    wrapperDiv.append(editorContainer);

}

StringToEmoji(document);

chrome.runtime.sendMessage({
    action: "getSource",
    source: "test"
});