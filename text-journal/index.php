<?PHP
	
	$username = 'eddswebs';
	$password = 'EATpoo1q2w#E';
	$host = "localhost";
	$database = "eddswebs_franksms";
	
	$conn = mysql_connect ( $host, $username, $password );
	mysql_select_db ( $database, $conn );
	
	
?>

<html>

<head>
<title>Text-Journal</title>
</head>

<body>
<h1>Text-Journal</h1>
<?PHP
	$data = mysql_query ( "SELECT * FROM sms ORDER BY id DESC" , $conn )or die ( mysql_error());
	
	while ( $row = mysql_fetch_array ( $data ) ) {
		
?>
<h2><?=$row['timestamp']?></h2>
<p>
	<?=$row['sms']?>
</p>
<?PHP	
	}
?>
</body>

</html>

