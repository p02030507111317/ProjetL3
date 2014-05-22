<?php
	header('Content-type: application/json'); 
	if (isset($_POST["field"]) AND isset($_POST["target"]) AND isset($_POST["mainrule"])) {
		$field = $_POST["field"];
		$target = $_POST["target"];
		$mainrule = $_POST["mainrule"];
		$current_field = str_replace('$TARGET', $target, $field);

		$ch = curl_init($current_field);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$output = curl_exec($ch);
		$output = preg_replace("/(\r\n|\n|\r|\t)/", " ", $output);
		$output = preg_replace("/([ ]+)/", " ", $output);
		curl_close($ch);

		$n = preg_match_all($mainrule, $output, $matches, PREG_PATTERN_ORDER);

		$noeuds = array();
		//TODO => S'ajouter soi même
		foreach (array_unique($matches["node"]) as $key => $value) {
			$val = array("id" => $value, "nom" => $matches["data"][$key]);
			array_push($noeuds, $val);
		}
		$links = array();
		foreach ($noeuds as $key => $value) {
			array_push($links, $value['id']);
		}
		$graph = array("noeud" => md5($target),
			"REGEXP" => $links		
				);
		$res = array(
			"noeuds" => $noeuds,
			"relations" => array("REGEXP"),
			"graphe" => array($graph)
				);
		echo json_encode($res);

	}
	else {
		echo "Requete mal formée";
	}
?>