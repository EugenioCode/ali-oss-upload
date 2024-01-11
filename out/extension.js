"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const upload_1 = require("./utils/upload");
const tools_1 = require("./utils/tools");
const path = require('path');
const addImageToEditor = (url) => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const { start, end, active } = editor.selection;
    if (start.line === end.line && start.character === end.character) {
        const activePosition = active;
        editor.edit((editBuilder) => {
            editBuilder.insert(activePosition, url);
        });
    }
    else {
        const selection = editor.selection;
        editor.edit((editBuilder) => {
            editBuilder.replace(selection, url);
        });
    }
};
function activate(context) {
    let texteditor = vscode.commands.registerTextEditorCommand('extension.chooseImage', async (textEditor, edit, args) => {
        const workspaceConfig = vscode.workspace.getConfiguration('upload_oss_config');
        let region = workspaceConfig.get('region', '');
        let accessKeyId = workspaceConfig.get('accessKeyId', '');
        let accessKeySecret = workspaceConfig.get('accessKeySecret', '');
        let bucket = workspaceConfig.get('bucket', '');
        const ossConfig = {
            region: (0, tools_1.deleteSpace)(region),
            accessKeyId: (0, tools_1.deleteSpace)(accessKeyId),
            accessKeySecret: (0, tools_1.deleteSpace)(accessKeySecret),
            bucket: (0, tools_1.deleteSpace)(bucket),
        };
        if (ossConfig.region !== '' || ossConfig.accessKeyId === '' || ossConfig.accessKeySecret === '' || ossConfig.bucket === '') {
            vscode.window.showInformationMessage('OSS配置不完整，请检查配置项', { modal: true }, '确认').then((btn) => {
                if (btn === '确认') {
                    const uri = vscode.Uri.parse('vscode:settings/ali-oss-upload');
                    vscode.commands.executeCommand('workbench.action.openSettings', uri);
                }
            });
            return;
        }
        const uri = await vscode.window.showOpenDialog({
            canSelectFolders: false,
            canSelectMany: false,
            filters: {
                images: ['png', 'jpg', 'jpeg', 'svg', 'gif']
            }
        });
        if (uri && uri.length > 0) {
            const selectedUri = uri[0];
            const fileName = vscode.workspace.asRelativePath(selectedUri.fsPath);
            const name = path.basename(fileName);
            const ossSavePath = workspaceConfig.get('ossSavePath', '');
            const ossHost = workspaceConfig.get('hostName', '');
            const data = await (0, upload_1.upLoadImageToOss)(selectedUri.fsPath, `${ossSavePath}/${new Date().getTime()}-${name}`, ossConfig);
            if (data.res.status === 200) {
                let newUrl = '';
                if (ossHost) {
                    newUrl = (0, tools_1.replaceBaseUrl)(data.url, ossHost);
                }
                else {
                    newUrl = data.url;
                }
                addImageToEditor(newUrl);
            }
        }
    });
    context.subscriptions.push(texteditor);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map