// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {upLoadImageToOss, OSSConfig} from './utils/upload';
import {replaceBaseUrl, deleteSpace} from './utils/tools';
const path = require('path');

const addImageToEditor = (url: string):void => {
	let editor = vscode.window.activeTextEditor;
	if(!editor) {return;}
	const {start, end, active} = editor.selection;
	if(start.line === end.line && start.character === end.character) {
		const activePosition = active;
		editor.edit((editBuilder) => {
			editBuilder.insert(activePosition, url);
		});
	} else {
		const selection = editor.selection;
		editor.edit((editBuilder) => {
      editBuilder.replace(selection, url);
    });
	}
};
export function activate(context: vscode.ExtensionContext) {
	let texteditor = vscode.commands.registerTextEditorCommand('extension.chooseImage',async (textEditor, edit,args) => {
		const workspaceConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('upload_oss_config');
		let region = workspaceConfig.get('region', '');
		let accessKeyId = workspaceConfig.get('accessKeyId', '');
		let accessKeySecret = workspaceConfig.get('accessKeySecret', '');
		let bucket = workspaceConfig.get('bucket', '');
		let formatType = workspaceConfig.get('formatType');
		const ossConfig: OSSConfig = {
			region: deleteSpace(region),
			accessKeyId: deleteSpace(accessKeyId),
			accessKeySecret: deleteSpace(accessKeySecret),
			bucket: deleteSpace(bucket),
		};
		console.log(formatType);
		if(ossConfig.region === '' || ossConfig.accessKeyId === '' || ossConfig.accessKeySecret === '' || ossConfig.bucket === '') {
			vscode.window.showInformationMessage('OSS配置不完整，请检查配置项', {modal: true}, '确认').then((btn: string | undefined) => {
				if(btn === '确认') {
					const uri = vscode.Uri.parse('vscode:settings/jianjunyang.ali-oss-upload');
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
			const data  = await upLoadImageToOss(selectedUri.fsPath,`${ossSavePath}/${new Date().getTime()}-${name}`, ossConfig);
			if(data.res.status === 200) {
				let newUrl = '';
				if(ossHost) {
					newUrl = replaceBaseUrl(data.url, ossHost);
				} else {
					newUrl = data.url;
				}
				if(formatType === 'url') {
					addImageToEditor(newUrl);
				}
				if(formatType === 'markdown') {
					addImageToEditor(`![${name}](${newUrl})`);
				}
				if(formatType === 'html') {
					addImageToEditor(`<img src="${newUrl}" alt="${name}">`);
				}
			}
		}
	}
	);
	context.subscriptions.push(texteditor);
}

// This method is called when your extension is deactivated
export function deactivate() {}
