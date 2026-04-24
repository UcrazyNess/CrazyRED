<?php

namespace App\Console\Commands;

use Illuminate\Console\GeneratorCommand;
use Nwidart\Modules\Facades\Module;
use Illuminate\Support\Str;

class ModuleGraphql extends GeneratorCommand
{
    protected $signature = 'module:make-graphql {name} {module} {--type=type}';
    protected $description = 'Create a new GraphQL class for a specific module';
    protected $type = 'GraphQL class';

    protected function getStub()
    {
        $type = strtolower($this->option('type'));
        return base_path("stubs/graphql-{$type}.stub");
    }

    // حیاتی: جلوگیری از پیش‌فرض App\ در نام کلاس
    protected function qualifyClass($name)
    {
        return $name;
    }

    protected function getPath($name)
    {
        $module = Module::find($this->argument('module'));
        // استخراج نام کلاس از نام کامل (Namespace + Class)
        $shortName = Str::afterLast($name, '\\');
        $typeDir = Str::plural(Str::studly($this->option('type')));

        return $module->getPath() . "/GraphQL/{$typeDir}/{$shortName}.php";
    }

    protected function getDefaultNamespace($rootNamespace)
    {
        $module = Str::studly($this->argument('module'));
        $typeDir = Str::plural(Str::studly($this->option('type')));
        return "Modules\\{$module}\\GraphQL\\{$typeDir}";
    }

    public function handle()
    {
        $moduleName = $this->argument('module');
        if (!Module::find($moduleName)) {
            $this->error("Module [{$moduleName}] does not exist!");
            return false;
        }

        // ساخت نام کامل کلاس برای پاس دادن به متدهای والد
        $name = $this->getDefaultNamespace('') . '\\' . Str::studly($this->argument('name'));

        if ($this->alreadyExists($name)) {
            $this->error($this->type . ' already exists!');
            return false;
        }

        $path = $this->getPath($name);
        $this->makeDirectory($path);
        $this->files->put($path, $this->buildClass($name));

        $this->info($this->type . ' created successfully.');
        return true;
    }
}
