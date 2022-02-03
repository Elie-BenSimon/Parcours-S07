<?php

namespace App\Http\Controllers;

use App\Models\Videogame;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VideogameController extends CoreController
{
    /**
     * /videogames
     * GET
     */
    public function list()
    {
        // Get all items
        $list = Videogame::all();

        // Return JSON of this list
        return $this->sendJsonResponse($list, 200);
    }

    /**
     * /videogames/[id]
     * GET
     */
    public function read($id)
    {
        // Get item or send 404 response if not
        $item = Videogame::find($id);

        // Si on a un résultat
        if (!empty($item)) {
            // Return JSON of this list
            return $this->sendJsonResponse($item, 200);
        } else { // Sinon
            // HTTP status code 404 Not Found
            return $this->sendEmptyResponse(404);
        }
    }

    /**
     * /videogames/[id]/reviews
     * GET
     */
    public function getReviews($id)
    {
        // Get item or send 404 response if not
        $item = Videogame::find($id);

        // Si on a un résultat
        if (!empty($item)) {
            // Retrieve all related Reviews (thanks to Relationships)
            // $reviews = $item->reviews->load(['videogame', 'platform']);
            // But, relationships with videogame & plaftorm are not configured yet
            $reviews = $item->reviews;

            // Return JSON of this list
            return $this->sendJsonResponse($reviews, 200);
        } else { // Sinon
            // HTTP status code 404 Not Found
            return $this->sendEmptyResponse(404);
        }
    }

    /**
     * HTTP Method : POST
     * URL : /videogames
     */
    public function add(Request $request)
    {
        //verifications of inputs
        if ($request->filled(['name', 'editor'])) {
            // instanciation of a new videogame class and hydratation
            $videogame = new Videogame();
            $videogame->name = $request->name;
            $videogame->editor = $request->editor;
            $videogame->status = 1;

            // if saving, we return a 201 hhtp code
            if ($videogame->save()) {
                return $this->sendJsonResponse($videogame, Response::HTTP_CREATED);
            }
            // else we send a 500 error code
            else {
                return $this->sendEmptyResponse(Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }
        // if mandatory inputs are not filled we send an bad request error
        else {
            return $this->sendEmptyResponse(Response::HTTP_BAD_REQUEST);
        }
    }
}
