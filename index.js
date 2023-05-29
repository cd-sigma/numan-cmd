const {spawn} = require("child_process");

async function runSync(command,options={},timeout) {
    return new Promise((resolve, reject) => {
        try {
            const child = spawn(command, options);

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
                    data: data ? data : null, stderr: stderr ? stderr : null , timedOut: false
                });
                return;
            });

            //for processes which never exit
            if (timeout) {
                setTimeout(() => {
                    child.kill();
                    resolve({
                        data: data ? data : null, stderr: stderr ? stderr : null, timedOut: true
                    });
                    return;
                }, timeout);
            }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    runSync: runSync
}