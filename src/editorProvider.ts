import * as vscode from 'vscode';

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export class EditorProvider implements vscode.CustomTextEditorProvider {
  public static register(context: vscode.ExtensionContext) {
    const provider = new EditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider(
      EditorProvider.viewType,
      provider
    );
    return providerRegistration;
  }

  private static readonly viewType = 'flame.editor';

  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly context: vscode.ExtensionContext) {}

  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    await webviewPanel.webview.postMessage({
      type: 'update',
    });
    // eslint-disable-next-line no-param-reassign
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    // eslint-disable-next-line no-param-reassign
    webviewPanel.webview.html = this.getHtml(webviewPanel.webview);
  }

  private getHtml(webview: vscode.Webview) {
    const scriptUri = webview
      .asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'index.js'))
      .toString();
    const scriptUri2 = webview
      .asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'vendor.js'))
      .toString();

    const nonce = getNonce();

    return /* html */ `
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
  <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
  <link rel="modulepreload" nonce="${nonce}" href="${scriptUri2}">
</head>
<body>
  <div id="app"></div>
</body>
</html>`;
  }
}
