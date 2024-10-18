import { ViewColumn, window } from "vscode";
import { getTemplate } from "../template";

export class BroswerService {
  async openNew(options: { url: string }) {
    const panel = window.createWebviewPanel(
      "panel-view-container",
      "Panel View",
      ViewColumn.One,
      {
        retainContextWhenHidden: true,
      }
    );
    panel.webview.html = await getTemplate(options.url);
    panel.reveal();
  }
}
