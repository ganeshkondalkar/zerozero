<div>
<?php
	if( $_SERVER["REQUEST_METHOD"] == "POST" ){
		parse_str($_POST["data"], $enquiryFormData);
		$to = "kumar@zerozero.co.in, kaushik@zerozero.co.in";
		$name = $enquiryFormData["name"];
		$email = $enquiryFormData["email"];
		$subject = $enquiryFormData["subject"];
		$message = $enquiryFormData["message"];

		$header = array();
		$header[] = "MIME-Version: 1.0";
		$header[] = "Content-type: text/plain; charset=iso-8859-1";
		$header[] = "From: " . $name . " <" . $email . ">";
		$header[] = "Reply-To: Kumar <kumar@zerozero.co.in>";
		$header[] = "Subject: {$subject}";
		$header[] = "X-Mailer: PHP/".phpversion();

		$returnValue = mail($to, $subject, $message, implode("\r\n", $header) );

		if( $returnValue == true ){
			echo "Thank you " . $name . " Your Message sent successfully.";
		} else {
			echo "<p>Sorry " . $name . " Your Message could not be sent.";
		}
	}
?>
</div>
