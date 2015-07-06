<?
/*
 * Version: 0.2
 */

class pr0 {
	var $users = [];
	var $cfg = [
		'api' => 'http://pr0gramm.com/api',
		'get' => 'items/get',
		'user' => 'profile/info',
		'sql' => [
			'prefix' => 'pr0',
			'sqlsrv' => 'localhost',
			'sqluser' => '',
			'sqlpwd' => '',
			'sqldb' => ''
		]
	];
	var $oldest = 0;
	var $sql;
	
	function __construct($max = 10) {
		if($max == -1)
			$max = 99999999999999999999;
		$this->sql = new mysqli($this->cfg['sql']['sqlsrv'], $this->cfg['sql']['sqluser'], $this->cfg['sql']['sqlpwd'], $this->cfg['sql']['sqldb']);
		$this->query(
			"truncate table `:prefix_user`", [
				':prefix' => $this->cfg['sql']['prefix']
			]
		);
		$i = 0;
		do {
			$get = ($this->oldest != 0)?$this->get($this->oldest):$this->get();
			foreach($get as $tmp) {
				if(!array_key_exists($tmp->user, $this->users)) {
					$user = $this->getUser($tmp->user);
					$this->users[$user->user->name] = [
						'id' => $user->user->id,
						'name' => $user->user->name,
						'benis' => $user->user->score
					];
					
					$this->query(
						"insert into `:prefix_user` values (:id, ':name', ':benis')", [
							':prefix' => $this->cfg['sql']['prefix'],
							':id' => $user->user->id,
							':name' => $user->user->name,
							':benis' => $user->user->score
						]
					);
				}
			}
			echo "\$i = {$i}\t\$user = ".count($this->users)."\n";
		} while(++$i < $max);
	}
	
	/*
	 * 1 = sfw
	 * 2 = nsfw
	 * 4 = nsfl
	 * sum of them: $flags
	 */
	function get($older=0, $flags=7) {
		$items = json_decode($this->web("{$this->cfg['api']}/{$this->cfg['get']}?flags={$flags}".(($older>0)?"&older={$older}":"")))->items;
		$this->oldest = $items[count($items)-1]->id;
		return $items;
	}
	function getUser($username) {
		return json_decode($this->web("{$this->cfg['api']}/{$this->cfg['user']}?name={$username}"));
	}
	function web($url) {
		return file_get_contents($url);
	}
	
	function query($query, $args = array()) {
		if(count($args) > 0)
			foreach($args as $key => $arg)
				$query = str_replace($key, $this->check($arg), $query);
		return $this->sql->query($query);
	}
	function check($value) {
		if(is_array($value)) {
			$return = array();
			foreach($value as $key => $tmp)
				$return[$key] = $this->sql->real_escape_string($tmp);
		}
		else
			$return = $this->sql->real_escape_string($value);
		return $return;
	}
}

if(@$_SERVER['TERM'] == 'xterm') {
	$pr0 = new pr0(-1);
}
else {
	echo "Nur Konsole.";
}