import asyncio

class Shell:
    @staticmethod
    async def run(command):
        proc = await asyncio.create_subprocess_exec(
            "bash", "-c", command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        out, err = await proc.communicate()
        if err: 
            return {"error": err.decode()}
        return {"out": out.decode()}
