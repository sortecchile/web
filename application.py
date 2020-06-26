from flask import Flask, render_template, request
from flask_mail import Mail, Message


app = Flask(__name__)

app.config['MAIL_SERVER'] = 'certiweb.hostchile.cl'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'ventas@electrode.cl'
app.config['MAIL_PASSWORD'] = 'Poillpoll123'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/contact")
def contact():
    return render_template("contact-us.html")


@app.route("/contact", methods=["GET","POST"]) #Van a ingresar data por el metodo post
def hello():
    if request.method == "GET":
       return render_template("error.html")
    else:
        name = request.form.get("name") #DE aqui tomamos el name que usamos en el input del contact-us.html
        email = request.form.get("email")
        #subject = request.form.get("subject")
        message = request.form.get("message")
        msg = Message(sender = 'ventas@electrode.cl', recipients= ['ncastellonb@udd.cl'], body=f'Mensaje cliente: {message}, correo cliente: {email}')
        mail.send(msg)
        return render_template("thank-you.html", name=name, email=email, message=message) #Aqui corremos una pagina llamada hello.html y le pasamos la variable name con la data

