const { dialog } = require('@electron/remote');
const AU = require('ansi_up')
var ansi_up = new AU.default;


function clearScriptOutput() {
    getCommandOutput().innerHTML = ""
    getStatus().innerHTML = "Status:";
}


const clearLogs = document.getElementById('clearLogs');
clearLogs.addEventListener('click', (event) => {

    clearScriptOutput()
})



function appendOutput(msg) { getCommandOutput().innerHTML += (ansi_up.ansi_to_html(msg) + "<br />"); getCommandOutput().scrollTop = getCommandOutput().scrollHeight };
function setStatus(msg) { getStatus().innerHTML = "Status: " + msg; getStatus().scrollTop = getStatus().scrollHeight };

function startNox() {
    //command, args, callback
    console.log(global.paths.nox);

    let noxPath = global.paths.nox;
    run_script(`"${noxPath.replaceAll('\\', '/')}"`);
    return;
}

function startScript() {
    //command, args, callback
    let bashPath = global.paths.bash;
    scriptDir = path.dirname(global.paths.script).replaceAll('\\', '/')
    scriptName = path.basename(global.paths.script).replaceAll('\\', '/')

    args = ['-c ' + `"cd ${scriptDir}; ./${scriptName} -n"`]
    //"C:\Program Files\Git\bin\sh.exe" - c "cd /c/Users/alexs/Desktop/AFK-Daily-master/AFK-Daily"

    run_script(`"${bashPath.replaceAll('\\', '/')}"`, args);
    return;
}

const btnStartNox = document.getElementById('btnStartNox');
btnStartNox.onclick = () => {
    startNox()
};

const btnStartScript = document.getElementById('btnStartScript');
btnStartScript.onclick = () => {
    startScript()
};

// "C:\Program Files\Git\bin\sh.exe" -c "cd /c/Users/alexs/Desktop/AFK-Daily-master/AFK-Daily"

//Uses node.js process manager

// This function will output the lines from the script
// and will return the full combined output
// as well as exit code when it's done (using the callback).
var childProcess = require("child_process");
function run_script(command, args, callback) {

    var child = childProcess.spawn(command, args, {
        encoding: "utf8",
        shell: true,
    });

    console.log('spawn called');
    console.log(command);
    console.log(args);

    // var child = child_process.spawn(command, args, {
    //     encoding: "utf8",
    //     shell: false,
    // });
    // You can also use a variable to save the output for when the script closes later
    child.on("error", (error) => {
        appendOutput(error);
        dialog.showMessageBox({
            title: "Title",
            type: "warning",
            message: "Error occured.\r\n" + error,
        });
    });

    child.stdout.on("data", (data) => {
        //Here is the output
        data = data.toString();
        appendOutput(data);
    });

    child.stderr.on("data", (data) => {
        //Here is the output from the command
        appendOutput(data);
    });

    child.on("close", (code) => {
        setStatus("Process ended:" + code);
    });
    if (typeof callback === "function") callback();
}

