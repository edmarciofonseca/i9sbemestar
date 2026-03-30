import './router.js';

function abrirDialog(idDialog) {

    const dialog = document.getElementById(idDialog);

    if (!dialog)
        return;

    if (typeof dialog.showModal === "function") {
        dialog.showModal();
    }
}

function fecharDialog(idDialog) {

    const dialog = document.getElementById(idDialog);

    if (!dialog)
        return;

    dialog.close();
}

window.abrirDialog = abrirDialog;
window.fecharDialog = fecharDialog;