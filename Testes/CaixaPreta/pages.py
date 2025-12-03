from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        # Tempo de espera  de 10s
        self.wait = WebDriverWait(driver, 10)

class LoginPage(BasePage):
    CAMPO_EMAIL = (By.ID, "email")
    CAMPO_SENHA = (By.ID, "password")
    BTN_ENTRAR  = (By.CLASS_NAME, "login-button")

    def logar(self, email, senha):
        self.driver.find_element(*self.CAMPO_EMAIL).send_keys(email)
        self.driver.find_element(*self.CAMPO_SENHA).send_keys(senha)
        self.driver.find_element(*self.BTN_ENTRAR).click()

class AdminPage(BasePage):
    # Seletores Admin/Prof
    BTN_NOVA_ATIVIDADE = (By.XPATH, "//a[contains(., 'Nova Atividade')] | //button[contains(., 'Nova Atividade')]")
    CAMPO_BUSCA        = (By.CSS_SELECTOR, ".search-box input")
    TITULOS_CARDS      = (By.CSS_SELECTOR, ".activity-card h3")

    MODAL_CAMPO_NOME      = (By.NAME, "name")
    MODAL_SELECT_TIPO     = (By.NAME, "type")
    MODAL_CAMPO_DESCRICAO = (By.CSS_SELECTOR, "textarea[name='description']")
    MODAL_CAMPO_DURACAO   = (By.NAME, "duration")
    MODAL_CAMPO_CAPACIDADE= (By.NAME, "capacity")
    MODAL_CAMPO_PROF      = (By.NAME, "professional")
    MODAL_BTN_SALVAR      = (By.CSS_SELECTOR, "button[type='submit']")

    def abrir_modal_cadastro(self):
        self.wait.until(EC.element_to_be_clickable(self.BTN_NOVA_ATIVIDADE)).click()

    def preencher_modal(self, nome, tipo, descricao, duracao, capacidade, profissional=None):
        self.wait.until(EC.visibility_of_element_located(self.MODAL_CAMPO_NOME))
        self.driver.find_element(*self.MODAL_CAMPO_NOME).clear()
        self.driver.find_element(*self.MODAL_CAMPO_NOME).send_keys(nome)
        
        if tipo:
            self.driver.find_element(*self.MODAL_SELECT_TIPO).send_keys(tipo)
        if descricao:
            campo_desc = self.wait.until(EC.element_to_be_clickable(self.MODAL_CAMPO_DESCRICAO))
            try:
                campo_desc.clear()
            except:
                self.driver.execute_script("arguments[0].value = '';", campo_desc)
            campo_desc.send_keys(descricao)
        self.driver.find_element(*self.MODAL_CAMPO_DURACAO).clear()
        self.driver.find_element(*self.MODAL_CAMPO_DURACAO).send_keys(duracao)
        self.driver.find_element(*self.MODAL_CAMPO_CAPACIDADE).clear()
        self.driver.find_element(*self.MODAL_CAMPO_CAPACIDADE).send_keys(capacidade)
        if profissional is not None:
            self.driver.find_element(*self.MODAL_CAMPO_PROF).clear()
            self.driver.find_element(*self.MODAL_CAMPO_PROF).send_keys(profissional)

    def salvar_formulario(self):
        self.driver.find_element(*self.MODAL_BTN_SALVAR).click()

    def buscar_atividade(self, termo):
        campo = self.wait.until(EC.visibility_of_element_located(self.CAMPO_BUSCA))
        campo.clear()
        campo.send_keys(termo)

    def obter_nomes_atividades(self):
        elementos = self.driver.find_elements(*self.TITULOS_CARDS)
        return [e.text for e in elementos]

    def lidar_com_alerta_sucesso(self):
        try:
            alerta = self.wait.until(EC.alert_is_present())
            texto = alerta.text
            alerta.accept() 
            return texto
        except:
            return None

# --- CLASSE DO ALUNO 
class StudentPage(BasePage):
    LINK_AGENDAR_AULA = (By.XPATH, "//a[contains(text(), 'Agendar Aula')]")
    
    # Botão "Agendar" nos cards
    BTNS_AGENDAR_LISTA = (By.XPATH, "//button[contains(., 'Agendar')]")

    # --- SELETORES DO MODAL
    MODAL_TITULO     = (By.XPATH, "//h2[contains(., 'Confirmar Agendamento')] | //div[contains(., 'Confirmar Agendamento')]")
    MODAL_INPUT_DATA = (By.XPATH, "//label[contains(., 'Data')]/following::input[1]")
    MODAL_INPUT_HORA = (By.XPATH, "//label[contains(., 'Horário')]/following::input[1]")
    
    MODAL_BTN_CONFIRMAR = (By.XPATH, "//button[contains(., 'Confirmar')]")

    def ir_para_agendar_aula(self):
        self.wait.until(EC.element_to_be_clickable(self.LINK_AGENDAR_AULA)).click()

    def clicar_em_agendar_primeira_atividade(self):
        # 1. Espera os botões carregarem
        botoes = self.wait.until(EC.presence_of_all_elements_located(self.BTNS_AGENDAR_LISTA))
        # 2. Garante que o primeiro botão é clicável
        self.wait.until(EC.element_to_be_clickable(botoes[0])).click()

    def preencher_modal_agendamento(self, data, hora):
        # 1. VALIDAÇÃO EXTRA: Espera o título do modal aparecer para garantir que abriu
        # O timeout aqui confirmará se o modal abriu ou não.
        self.wait.until(EC.visibility_of_element_located(self.MODAL_TITULO))

        # 2. Preenche Data
        campo_data = self.wait.until(EC.visibility_of_element_located(self.MODAL_INPUT_DATA))
        campo_data.clear()
        campo_data.send_keys(data)
        
        # 3. Preenche Hora
        campo_hora = self.driver.find_element(*self.MODAL_INPUT_HORA)
        campo_hora.clear()
        campo_hora.send_keys(hora)

    def confirmar_agendamento(self):
        self.wait.until(EC.element_to_be_clickable(self.MODAL_BTN_CONFIRMAR)).click()

    def lidar_com_alerta(self):
        try:
            alerta = self.wait.until(EC.alert_is_present())
            texto = alerta.text
            alerta.accept()
            return texto
        except:
            return None