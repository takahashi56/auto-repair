<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your 100 Point Digital Car Report is Ready!</title>
</head>
<body bgcolor="#f7f7f7">
<p>Dear {{$data->customer}}</p>
<p>Your car, {{$data->make}} {{$data->model}} {{$data->year}}, {{$data->trim}} is now ready. You can view details by <a href="{{$url}}" target="_blank">clicking here</a>.</p>
<p>Don’t forget to book your next appointment on <a href="http://autobody.ae/">www.autobody.ae</a>. We hope to see you soon!</p>
<p>Best Regards,</p>
<p>Gargash Autobody</p>
</body>
</html>