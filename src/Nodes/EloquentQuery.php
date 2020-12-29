<?php

namespace DataStory\Nodes;

use DataStory\Categories\Model;
use DataStory\NodeModel;
use DataStory\Parameters\String_;
use Illuminate\Support\Str;

class EloquentQuery extends NodeModel
{
    const IN_PORTS = [];

    const CATEGORY = Model::class;

    public function run()
    {
        $this->output(
            $this->getQueryResults()            
        );
    }

    protected function getQueryResults()
    {
        // Get QueryBuilder
        $query = app($this->data->options->parameters->target_model->value)->query();

        // Apply scopes
        collect([])->reduce(function($query, $scope) {
            $name = $scope->name;
            $args = $scope->args;
            return $query->$name(...$args);
        }, $query);

        // Apply where statements
        collect([])->reduce(function($query, $whereStatement) {
            return $query->where(...$whereStatement->args);
        }, $query);

        // Apply take/limit
        $query->take($this->getLimit());
        
        // Return results
        return $query->get();
    }

    public static function describe(array $variation = [])
    {
        $variation['shortModel'] = class_basename($variation['model']);
        $variation['shortModelPlural'] = (string) Str::of($variation['shortModel'])->plural();

        $description = parent::describe($variation);
        $description->name = $variation['shortModel'];
        $description->summary = $variation['shortModel'] . '::query()->where(...)';
        
        return $description;
    }

    public static function parameters($variation = [])
    {
        return [
            String_::make('node_name')->default($variation['shortModelPlural']),
            String_::make('target_model')->default($variation['model']),
            String_::make('scopes')->default('no scopes available'),
            String_::make('where_statements')->default(''),
            String_::make('limit')->default('')->placeholder('no limit'),
            String_::make('run get()')->default('yes'),
        ];
    }
    
    public static function variations()
    {
        return [
            ...static::getAppModels()->map(function($model) {
                return static::describe([
                    'model' => $model
                ]);
            })->toArray()
        ];
    }

    protected function getLimit()
    {
        $limit = $this->data->options->parameters->limit->value;

        if(is_numeric($limit)) {
            return $limit;
        }

        return PHP_INT_SIZE;
    }

    protected static function getAppModels()
    {
		$models = collect();

        $finder = new \Symfony\Component\Finder\Finder();
        $finder->files()->name('*.php')->in(base_path().'/app/Models');

        foreach ($finder as $file) {
            $namespace = 'App\\Models\\';

            if ($relativePath = $file->getRelativePath()) {
                $namespace .= strtr($relativePath, '/', '\\') . '\\';
            }

            $class = $namespace . $file->getBasename('.php');

            try {
                $r = new \ReflectionClass($class);

                if ($r->isSubclassOf('Illuminate\\Database\\Eloquent\\Model')) {
                  $models->push($class);
                }
            } catch (\Throwable $e) {
                //
            }
        }
		return collect($models);        
    }
}