import psutil


class SystemMonitor:
    _ = psutil.cpu_percent(interval=None)       
    @staticmethod
    def get_static_info():
        return {
            "CPU_cores": psutil.cpu_count(),
            "RAM_total": psutil.virtual_memory().total,
            "SWAP_total": psutil.swap_memory().total
        }
    
    @staticmethod
    def monitor():
         return {
            "CPU_used_percent": psutil.cpu_percent(interval=None),
            "RAM_used_percent": psutil.virtual_memory().percent, 
            "SWAP_used": psutil.swap_memory().used
        }
