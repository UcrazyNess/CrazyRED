<?php

namespace Modules\Thalamus\Providers;

use Nwidart\Modules\Support\ModuleServiceProvider;
use Illuminate\Console\Scheduling\Schedule;
use Rebing\GraphQL\Support\Facades\GraphQL;
use File;
use Modules\Thalamus\GraphQL\Types\User;

class ThalamusServiceProvider extends ModuleServiceProvider
{
    /**
     * The name of the module.
     */
    protected string $name = 'Thalamus';

    /**
     * The lowercase version of the module name.
     */
    protected string $nameLower = 'thalamus';

    /**
     * Command classes to register.
     *
     * @var string[]
     */
    // protected array $commands = [];

    /**
     * Provider classes to register.
     *
     * @var string[]
     */
    protected array $providers = [
        EventServiceProvider::class,
        RouteServiceProvider::class,
    ];

    protected array $graphQLTypes = [
        'User' => User::class
    ];

    /**
     * Define module schedules.
     *
     * @param $schedule
     */
    // protected function configureSchedules(Schedule $schedule): void
    // {
    //     $schedule->command('inspire')->hourly();
    // }


    public function boot(): void
    {
        parent::boot();

        foreach ($this->graphQLTypes as $name => $class) {
            GraphQL::addType($class, $name);
        }
    }

    public function register(): void
    {
        parent::register();

        $configPath = module_path($this->name, 'Config/graphql_schema.php');

        if (File::exists($configPath)) {
            $this->mergeConfigFrom($configPath, 'graphql.schemas.default');
        }
    }
}
