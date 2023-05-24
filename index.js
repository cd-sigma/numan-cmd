const {spawn} = require("child_process");

async function runSync(command) {
    return new Promise((resolve, reject) => {
        try {
            const child = spawn(command, {shell: true, maxBuffer: 1024 * 1024});

            let data = "", stderr = "";

            child.stdout.setEncoding('utf8');
            child.stdout.on("data", (result) => {
                data += result;
            });

            child.stderr.on("data", (err) => {
                stderr += err;
            });

            child.on("exit", (code) => {
                resolve({
                    data: data ? data : null, stderr: stderr ? stderr : null,
                });
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    runSync: runSync
}