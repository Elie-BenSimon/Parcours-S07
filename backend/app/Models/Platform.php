<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Platform extends Model
{
    /**
     * Get all related reviews
     */
    public function reviews()
    {
        return $this->hasMany('App\Models\Review');
    }
}
