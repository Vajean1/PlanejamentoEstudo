from flask import Flask, render_template, request, redirect, url_for, jsonify
import os
import json

app = Flask(__name__)
app.secret_key = 'sua_chave_secreta' #Chave secreta nunca deve ser armazenada em uma variável, é interessante ser armazenada em ambiente. Mas como é uma aplicação local, tudo bem.

#Home page
@app.route("/")
def index():
    return render_template('index.html')

#Planejamento page
@app.route("/planejamento")
def planejamento():
    return render_template('planejamento.html')

#Simulados page 

#Semi DB, não há necessidade de criar um sqlite3
SIMULADO_DATA_FILE = 'simulados.json'

# Diretório para salvar os arquivos PDF
UPLOAD_FOLDER = 'static/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Função para carregar os dados dos simulados
def load_simulados():
    if os.path.exists(SIMULADO_DATA_FILE):
        with open(SIMULADO_DATA_FILE, 'r') as f:
            return json.load(f)
    return []

# Função para salvar os dados dos simulados
def save_simulados(simulados):
    with open(SIMULADO_DATA_FILE, 'w') as f:
        json.dump(simulados, f, indent=4)

# Carrega os dados ao iniciar o servidor
simulados = load_simulados()

@app.route('/simulado', methods=['GET', 'POST'])
def simulado():
    global simulados

    if request.method == 'POST':
        # Recebe os dados do formulário
        nome = request.form.get('nome')
        total_questoes = int(request.form.get('total_questoes'))
        acertos = int(request.form.get('acertos'))
        erros = int(request.form.get('erros'))
        porcentagem = (acertos / total_questoes) * 100
        
        # Recebe o arquivo PDF
        file = request.files.get('pdf')
        if file and file.filename.endswith('.pdf'):
            # Gera o caminho único para o arquivo
            filename = file.filename
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            # Adiciona o simulado à lista
            simulado = {
                'nome': nome,
                'total_questoes': total_questoes,
                'acertos': acertos,
                'erros': erros,
                'porcentagem': round(porcentagem, 2),
                'pdf': filename
            }
            simulados.append(simulado)

            # Salva os dados no arquivo JSON
            save_simulados(simulados)
        else:
            return "Erro: Envie um arquivo PDF válido!", 400

        return redirect(url_for('simulado'))

    return render_template('simulado.html', simulados=simulados)

@app.route('/remover/<int:index>', methods=['POST'])
def remover_simulado(index):
    global simulados

    # Remove o simulado da lista e também apaga o arquivo correspondente
    simulado = simulados.pop(index)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], simulado['pdf'])
    if os.path.exists(filepath):
        os.remove(filepath)
    
    # Atualiza o arquivo JSON
    save_simulados(simulados)

    return redirect(url_for('simulado'))

# Aba timer

@app.route('/timer')
def timer():
    return render_template('timer.html')

# Aba de análise

@app.route('/analise')
def analise():
    if os.path.exists('simulados.json'):
        with open('simulados.json', 'r') as file:
            simulados = json.load(file)
    else:
        simulados = []

    total_simulados = len(simulados)
    media_acertos = round(
        sum(s['porcentagem'] for s in simulados) / total_simulados, 2
    ) if total_simulados > 0 else 0

    melhor_simulado = max(simulados, key=lambda x: x['porcentagem'], default=None)
    melhor_nome = melhor_simulado['nome'] if melhor_simulado else 'N/A'
    melhor_porcentagem = melhor_simulado['porcentagem'] if melhor_simulado else 0

    return render_template(
        'analise.html',
        simulados=simulados,
        media_acertos=media_acertos,
        melhor_simulado=melhor_nome,
        melhor_porcentagem=melhor_porcentagem
    )


if __name__ == '__main__':
    app.run(debug=True)
