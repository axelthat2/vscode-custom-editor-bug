var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/extension.ts
__export(exports, {
  activate: () => activate
});

// src/editorProvider.ts
var vscode = __toModule(require("vscode"));
function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
var _EditorProvider = class {
  constructor(context) {
    this.context = context;
  }
  static register(context) {
    const provider = new _EditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(_EditorProvider.viewType, provider);
    return providerRegistration;
  }
  async resolveCustomTextEditor(document, webviewPanel, token) {
    await webviewPanel.webview.postMessage({
      type: "update"
    });
    webviewPanel.webview.options = {
      enableScripts: true
    };
    webviewPanel.webview.html = this.getHtml(webviewPanel.webview);
  }
  getHtml(webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "dist", "index.js")).toString();
    const scriptUri2 = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "dist", "vendor.js")).toString();
    const nonce = getNonce();
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <!--
  Use a content security policy to only allow loading images from https or from our extension directory,
  and only allow scripts that have a specific nonce.
  -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script type="module" nonce="${nonce}" src="${scriptUri}"><\/script>
  <link rel="modulepreload" nonce="${nonce}" href="${scriptUri2}">
</head>
<body>
  <div id="app"></div>
</body>
</html>`;
  }
};
var EditorProvider = _EditorProvider;
EditorProvider.viewType = "flame.editor";

// src/extension.ts
function activate(context) {
  context.subscriptions.push(EditorProvider.register(context));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
//# sourceMappingURL=extension.js.map
