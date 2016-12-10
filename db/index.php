<?php

	// Check if is set action request
	if(isset($_POST['action']) && !empty($_POST['action'])) {
		
		$db = new PDO('sqlite:db.sqlite');
		
		if( $db == null ) {
			echo 'fail';
			die;
		} else {
			$action = $_POST['action'];
	    	switch($action) {
		        case 'get_cards':
		        	get_cards($db);
		        	break;
		        case 'get_card':
		        	get_card($db);
		        	break;
		        case 'get_card_by_id':
		        	get_card_by_id($db);
		        	break;
		        case 'add_card':
		        	add_card($db);
		        	break;
		        case 'edit_card':
		        	edit_card($db);
		        	break;
		        case 'delete_card':
		        	delete_card($db);
		        	break;
		        case 'candy':
		        	add_candy($db);
		        	break;
		    }
		}
	}

	// Get full list of available cards from data base
	function get_cards($db) {
		
		$result = $db->prepare('SELECT * FROM cards ORDER BY id ASC');
		$result->execute();
		$output = json_encode($result->fetchAll(PDO::FETCH_ASSOC));
		echo $output;

	}

	// Get random card from data base
	function get_card($db) {

		$result = $db->prepare('SELECT * FROM cards ORDER BY RANDOM() LIMIT 1');
		$result->execute();
		$output = json_encode($result->fetchAll(PDO::FETCH_ASSOC));
		echo $output;

	}

	function get_card_by_id($db) {

		$id = isset($_POST['id']) ? $_POST['id'] : 0;

		$result = $db->prepare('SELECT * FROM cards WHERE id='.$id.'');
		$result->execute();
		$output = json_encode($result->fetchAll(PDO::FETCH_ASSOC));
		echo $output;

	}

	function edit_card($db) {

		$id = isset($_POST['id']) ? $_POST['id'] : 0;
		$word = isset($_POST['word']) ? $_POST['word'] : null;
		$draw = isset($_POST['draw']) ? $_POST['draw'] : 0;
		$say = isset($_POST['say']) ? $_POST['say'] : 0;
		$show = isset($_POST['show']) ? $_POST['show'] : 0;
		
		$result = $db->prepare("UPDATE cards SET word='$word', draw='$draw', say='$say', show='$show' WHERE id ='$id'");
		$result->execute();
		echo json_encode(array('word' => $word, 'draw' => $draw, 'say' => $say, 'show' => $show, 'id' => $id));

	}

	function delete_card($db) {
		$id = isset($_POST['id']) ? $_POST['id'] : 0;

		$result = $db->prepare('DELETE FROM cards WHERE id='.$id.'');
		$result->execute();
		$output = json_encode(array('id' => $id));

		echo $output;
	}

	// Insert new card to the data base
	function add_card($db) {
		$word = isset($_POST['word']) ? $_POST['word'] : null;
		$draw = isset($_POST['draw']) ? $_POST['draw'] : 0;
		$say = isset($_POST['say']) ? $_POST['say'] : 0;
		$show = isset($_POST['show']) ? $_POST['show'] : 0;

		$result = $db->prepare('INSERT INTO cards (word, draw, say, show) VALUES (?, ?, ?, ?)');
		$result->execute(array($word, $draw, $say, $show));

		$count = get_count($db);

		echo json_encode(array('word' => $word, 'draw' => $draw, 'say' => $say, 'show' => $show, 'count' => $count, 'id' => $db->lastInsertId()));
	}

	// Get count of items at the data base
	function get_count($db) {
		
		$result = $db->prepare('SELECT count(*) FROM cards');
		$result->execute();
		$count = $result->fetchAll(PDO::FETCH_ASSOC);
		
		return $count[0]['count(*)'];
	}

	function add_candy($db) {

		$time = isset($_POST['time']) ? $_POST['time'] : null;
		$agent = isset($_POST['agent']) ? $_POST['agent'] : null;
		$platform = isset($_POST['platform']) ? $_POST['platform'] : null;

		$result = $db->prepare('INSERT INTO candy_count (time, agent, platform) VALUES (?, ?, ?)');
		$result->execute(array($time, $agent, $platform));

		$result = $db->prepare('UPDATE candy SET count=count+1 WHERE id=1');
		$result->execute();

		$result = $db->prepare('SELECT count FROM candy WHERE id=1');
		$result->execute();
		$output = json_encode($result->fetchAll(PDO::FETCH_ASSOC));
		echo $output;

	}
?>