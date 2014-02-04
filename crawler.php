<?php
	if (isset($_POST["field"]) AND isset($_POST["target"]) AND isset($_POST["mainrule"]) AND isset($_POST["excludes"])) {
		$field = $_POST["field"];
		$target = $_POST["target"];
		$mainrule = $_POST["mainrule"];
		$current_field = str_replace('$TARGET', $target, $field);
		$excludes = $_POST["excludes"];

		$ch = curl_init($current_field);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$output = curl_exec($ch);
		curl_close($ch);

		$n = preg_match_all($mainrule, $output, $matches, PREG_PATTERN_ORDER);

		$noeuds = array();
		foreach (array_unique($matches[1]) as $key => $value) {
			$val = array("id" => md5($value), "nom" => $value);
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