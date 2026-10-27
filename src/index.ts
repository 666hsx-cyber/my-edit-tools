import * as vscode from 'vscode';
import { find, openTerminal, formatSelection } from './handlers';

let commandRegistrations: vscode.Disposable[] = [];

function isPluginEnabled(): boolean {
    const config = vscode.workspace.getConfiguration('my-edit-tools');
    return config.get<boolean>('enabled', true);
}

function registerCommands(context: vscode.ExtensionContext): void {
    const commands: Array<{ id: string; handler: (...args: any[]) => any }> = [
        { id: 'my-edit-tools.find', handler: find },
        { id: 'my-edit-tools.openTerminal', handler: openTerminal },
        { id: 'my-edit-tools.formatSelection', handler: formatSelection }
    ];

    for (const cmd of commands) {
        const disposable = vscode.commands.registerCommand(cmd.id, cmd.handler);
        commandRegistrations.push(disposable);
        context.subscriptions.push(disposable);
    }
}

function unregisterCommands(): void {
    for (const disposable of commandRegistrations) {
        disposable.dispose();
    }
    commandRegistrations = [];
}

export function activate(context: vscode.ExtensionContext): void {
    if (isPluginEnabled()) {
        registerCommands(context);
    }

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration('my-edit-tools.enabled')) {
                if (isPluginEnabled()) {
                    if (commandRegistrations.length === 0) {
                        registerCommands(context);
                        vscode.window.showInformationMessage(
                            vscode.l10n.t('Edit tools plugin enabled')
                        );
                    }
                } else {
                    if (commandRegistrations.length > 0) {
                        unregisterCommands();
                        vscode.window.showInformationMessage(
                            vscode.l10n.t('Edit tools plugin disabled')
                        );
                    }
                }
            }
        })
    );

    console.log(vscode.l10n.t('Edit tools plugin activated'));
}

export function deactivate(): void {
    unregisterCommands();
    console.log(vscode.l10n.t('Edit tools plugin deactivated'));
}
