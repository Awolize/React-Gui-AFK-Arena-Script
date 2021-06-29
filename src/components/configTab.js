

let configPath = ""
try {
    configPath = path.resolve(path.join(path.dirname(global.paths.script), 'config.sh'))

    console.log(configPath);

    fs.readFile(configPath, (err, data) => {
        if (err) {
            alert(err);
            return err;
        };

        document.getElementById('configFileContent').innerHTML = data;
    });

} catch (err) {
    alert("Could not find AFK-Arena Script config file")
}
