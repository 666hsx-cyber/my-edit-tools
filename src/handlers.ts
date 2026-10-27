import * as vscode from 'vscode';

// 查找命令
export function find(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage(vscode.l10n.t('No active editor'));
        return;
    }

    // 使用 VS Code 内置的查找功能
    vscode.commands.executeCommand('actions.find');
}

// 打开终端命令
export function openTerminal(): void {
    const uri = vscode.workspace.workspaceFolders?.[0]?.uri;
    const terminal = vscode.window.createTerminal({
        name: vscode.l10n.t('Plugin Terminal'),
        cwd: uri?.fsPath || ''
    });
    terminal.show();
}

// 格式化选中代码命令
export async function formatSelection(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showInformationMessage(vscode.l10n.t('No active editor'));
        return;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
        vscode.window.showInformationMessage(vscode.l10n.t('Please select code to format first'));
        return;
    }

    try {
        await vscode.commands.executeCommand('editor.action.formatSelection');
        vscode.window.showInformationMessage(vscode.l10n.t('Format successful'));
    } catch (error) {
        vscode.window.showErrorMessage(
            vscode.l10n.t('Format failed: {error}', { error: String(error) })
        );
    }
}
