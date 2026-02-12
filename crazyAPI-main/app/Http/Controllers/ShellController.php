<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class ShellController extends Controller
{
    public function command(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'command' => ['required']
        ]);

        if ($validated->fails()) {
            return response()->json([
                'errors' => $validated->errors()
            ], 422);
        }
        $validated = $validated->validated();
        $commands = $this->comandChek($validated["command"]);
        if(!$commands){
            return response()->json(
                ['massage'=>"bad coomand"]
            ,422);
        }
        $response =$response = Http::withBody(
        json_encode(['command' => $commands]),
        'application/json'
        )->post('http://127.0.0.1:5000/command');


        if ($response->successful()) {
            $sysInfo = $response->json();
            return response()->json([
                'status' => 'success',
               'result' => $sysInfo["out"] ?? $sysInfo["error"] ?? null
            ],200);
        }
        return response()->json(['error' => "docer isn't availbae"], 500);
    }
    public function monitor(Request $request)
    {
        $response = Http::get("http://127.0.0.1:5000/monitor");

        if ($response->successful()) {
            $sysInfo = $response->json();

            return response()->json([
                'status' => 'success',
                'cpu' => $sysInfo["CPU_used_percent"],
                "ram"=> $sysInfo[ "RAM_used_percent"],
                'processes' => []
            ],200);
        }
        return response()->json(['error' => "docer isn't availbae"], 500);
    }

    private function comandChek ($command)  {
        $refusedCommands = [
        // مدیریت فایل و حذف
        'shred', 'dd', 'mkfs', 'format',

        // دسترسی و کاربران
        'sudo', 'su', 'useradd', 'userdel', 'groupadd', 'passwd', 'visudo', 'chroot',

        // شبکه و دسترسی از راه دور
        'ssh', 'scp', 'sftp', 'ftp', 'telnet', 'nc', 'netcat', 'ncat',

        // بارگذاری فایل (ممکن است برای دانلود بدافزار استفاده شود)
        'curl', 'wget', 'git', 'lynx',

        // پروسس‌ها و سیستم
        'shutdown', 'reboot', 'halt', 'poweroff', 'kill', 'pkill', 'killall', 'crontab',

        // مشاهده فایل‌های سیستمی
        'etc/shadow', 'etc/passwd', 'etc/group', '.env'
    ];
        $commands = explode(' ',$command) ;
        $commands = array_map(  function ($cmd) {
            return preg_replace("/[^a-zA-Z0-9\-]+$/", '', $cmd);
        },$commands);
        foreach($commands as $command){
            if(in_array($command,$refusedCommands)){
                return false;
            }
        }
        return implode(' ', $commands);
    }
}

