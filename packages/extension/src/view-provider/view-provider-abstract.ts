import { ExtensionContext, Uri, Webview, WebviewPanel, WebviewView } from 'vscode';
import { readFileSync } from 'node:fs';
import { join } from 'path';
import { modifyHtml } from 'html-modifier';
import { HandlerConfig, JsonrpcServer, expose } from '@jsonrpc-rx/server';

export type ViewProviderOptions = {
  distDir: string;
  indexPath: string;
};

export abstract class AbstractViewProvider {
  static WEBVIEW_INJECT_IN_MARK = '__webview_public_path__';

  /**
   * 构造方法
   * @param context 该插件的上下文，在插件激活时可以获取
   * @param handlers jsonrpc-rx 中的处理逻辑的配置
   * @param wiewProviderOptions 相关配置
   */
  constructor(
    protected context: ExtensionContext,
    protected handlers: HandlerConfig,
    protected wiewProviderOptions: ViewProviderOptions,
  ) {}

  /**
   * 用于实现 webviewView 的处理逻辑，例如：html 赋值、通讯、设置 webviewView 参数等
   * @param webviewView 可以为 vscode.WebviewView 或者 vscode.WebviewPanel 的实例
   */
  abstract resolveWebviewView(webviewView: WebviewView | WebviewPanel): void;

  protected exposeHandlers(webview: Webview) {
    const jsonrpcServer = new JsonrpcServer(webview.postMessage.bind(webview), webview.onDidReceiveMessage.bind(webview));
    expose(jsonrpcServer, this.handlers);
  }

  /**
   * 处理前端应用 index.html 文件的方法
   * @param webview vscode.Webview 类型，指向 vscode.WebviewView 的一个属性：webview
   * @returns 处理好的 index.html 文本内容
   */
  protected async getWebviewHtml(webview: Webview) {
    const { distDir, indexPath } = this.wiewProviderOptions;
    const webviewUri = webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, distDir)).toString();
    const injectInContent = `<script> window.${AbstractViewProvider.WEBVIEW_INJECT_IN_MARK} = "${webviewUri}"</script>`;

    const htmlPath = join(this.context.extensionPath, indexPath);
    const htmlText = readFileSync(htmlPath).toString();
    return await modifyHtml(htmlText, {
      onopentag(name, attribs) {
        if (name === 'script') attribs.src = join(webviewUri, attribs.src);
        if (name === 'link') attribs.href = join(webviewUri, attribs.href);
        return { name, attribs };
      },
      oncomment(data) {
        const hasMark = data?.toString().toLowerCase().includes(AbstractViewProvider.WEBVIEW_INJECT_IN_MARK);
        return hasMark ? { data: injectInContent, clearComment: true } : { data };
      },
    });
  }
}
