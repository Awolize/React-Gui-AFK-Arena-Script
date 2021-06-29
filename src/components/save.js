import { fs } from "fs";
import { path } from "path";




const saveHandler = () => {
    function init(params) {
        // Check if save file exist and if files exist on those paths
        // Does files exist?
        const object = [global.paths.nox, global.paths.script, global.paths.bash]
        const alertMsg = [];
        for (const key in object) {
            if (Object.hasOwnProperty.call(object, key)) {
                if (fs.existsSync(object[key]))
                    continue;
                else
                    alertMsg.push(object[key]);
            }
        }

        // Alert - if paths could not be resolved
        if (alertMsg.length)
            alert("Could not find file on: " + "\n" + alertMsg.join("\n"))


        const saveBtn = document.getElementById('saveButton');
        saveBtn.addEventListener('click', () => eventSaveToSavefile());

        const resetBtn = document.getElementById('resetButton');
        resetBtn.addEventListener('click', () => eventResetSavefile());

        const noxFileInput = document.querySelector("#file-nox-path input[type=file]");
        noxFileInput.onchange = () => {
            const fileName = document.querySelector("#file-nox-path .file-name");
            fileName.textContent = noxFileInput.files[0].name;
            global.paths.nox = noxFileInput.files[0].path
        };

        const scriptFileInput = document.querySelector("#file-script-path input[type=file]");
        scriptFileInput.onchange = () => {
            const fileName = document.querySelector("#file-script-path .file-name");
            fileName.textContent = scriptFileInput.files[0].name;
            global.paths.script = scriptFileInput.files[0].path
        };

        const bashFileInput = document.querySelector("#file-bash-path input[type=file]");
        bashFileInput.onchange = () => {
            const fileName = document.querySelector("#file-bash-path .file-name");
            fileName.textContent = bashFileInput.files[0].name;
            global.paths.bash = bashFileInput.files[0].path
        };

    }
}