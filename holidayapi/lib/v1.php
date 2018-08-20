<?php
namespace HolidayAPI;

class v1
{
    private $parameters = array();

    public function __set($variable, $value)
    {
        $this->parameters[$variable] = $value;
    }

    public function __construct($key = null)
    {
        if ($key) {
            $this->key = $key;
        }
    }

    public function holidays($parameters = array())
    {
		
        $parameters = array_merge($this->parameters, $parameters);
        $parameters = http_build_query($parameters);

        $url  = 'https://holidayapi.com/v1/holidays?' . $parameters;
		@$response = file_get_contents($url); 
		@$response = json_decode($response, true);
		$status = isset($response['status']) ? $response['status'] : '';
		//echo $status.'<br/>';
		 
		if($status=="200")
		{
			echo "Success";
		} else {
			echo "Something went wrong, holiday API unable to fetch data for given year!";
		}
		
		return $response;
        /*$curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL            => $url,
            CURLOPT_HEADER         => false,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_RETURNTRANSFER => true,
        ));

        $response = curl_exec($curl);

        if ($error = curl_error($curl)) {
            return false;
        }

        curl_close($curl);
        $response = json_decode($response, true);
	
        if (!$response) {
            return false;
        }

        return $response;*/
    }
}

