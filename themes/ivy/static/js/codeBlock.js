window.onload = function() {
    const codeBlocks = document.getElementsByClassName("highlight");
    for (let codeBlock of codeBlocks) {
        let codeNode = codeBlock.getElementsByTagName("code")[0];
        let pre =  codeBlock.getElementsByTagName("pre")[0]
        let lang = codeNode.getAttribute("data-lang");
        let codeLangDiv = document.createElement("div");
        codeLangDiv.className = "code-lang";
        codeLangDiv.innerHTML = lang;
        pre.insertBefore(codeLangDiv, codeNode);
    }
}