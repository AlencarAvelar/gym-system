from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 5)

class LoginPage(BasePage):
    # Elementos do Login.js
    CAMPO_EMAIL = (By.ID, "email")
    CAMPO_SENHA = (By.ID, "password")
    BTN_ENTRAR  = (By.CLASS_NAME, "login-button")

    def logar(self, email, senha):
        self.driver.find_element(*self.CAMPO_EMAIL).send_keys(email)
        self.driver.find_element(*self.CAMPO_SENHA).send_keys(senha)
        self.driver.find_element(*self.BTN_ENTRAR).click()

class AdminPage(BasePage):
    # Elementos do ActivityManagement.js
    BTN_NOVA_ATIVIDADE = (By.CLASS_NAME, "btn-new-activity")
    CAMPO_BUSCA        = (By.CSS_SELECTOR, ".search-box input")
    CARDS_ATIVIDADE    = (By.CLASS_NAME, "activity-card")
    TITULOS_CARDS      = (By.CSS_SELECTOR, ".activity-card h3")

    # Elementos do Modal de Cadastro (dentro do form)
    MODAL_CAMPO_NOME      = (By.NAME, "name")
    MODAL_SELECT_TIPO     = (By.NAME, "type")
    MODAL_CAMPO_DURACAO   = (By.NAME, "duration")
    MODAL_CAMPO_CAPACIDADE= (By.NAME, "capacity")
    MODAL_CAMPO_PROF      = (By.NAME, "professional")
    MODAL_BTN_SALVAR      = (By.CLASS_NAME, "btn-confirm")

    def abrir_modal_cadastro(self):
        self.wait.until(EC.element_to_be_clickable(self.BTN_NOVA_ATIVIDADE)).click()

    def preencher_modal(self, nome, tipo, duracao, capacidade, profissional):
        # Aguarda o modal abrir e o campo nome estar visível
        self.wait.until(EC.visibility_of_element_located(self.MODAL_CAMPO_NOME))
        
        self.driver.find_element(*self.MODAL_CAMPO_NOME).send_keys(nome)
        
        # Seleciona o tipo se for passado
        if tipo:
            self.driver.find_element(*self.MODAL_SELECT_TIPO).send_keys(tipo)
            
        self.driver.find_element(*self.MODAL_CAMPO_DURACAO).send_keys(duracao)
        self.driver.find_element(*self.MODAL_CAMPO_CAPACIDADE).send_keys(capacidade)
        self.driver.find_element(*self.MODAL_CAMPO_PROF).send_keys(profissional)

    def salvar_formulario(self):
        self.driver.find_element(*self.MODAL_BTN_SALVAR).click()

    def buscar_atividade(self, termo):
        campo = self.wait.until(EC.visibility_of_element_located(self.CAMPO_BUSCA))
        campo.clear()
        campo.send_keys(termo)

    def obter_nomes_atividades(self):
        # Retorna uma lista com os textos dos H3 de cada card
        elementos = self.driver.find_elements(*self.TITULOS_CARDS)
        return [e.text for e in elementos]

    def lidar_com_alerta_sucesso(self):
        # O sistema usa window.alert(), então precisamos mudar o foco para ele
        alerta = self.wait.until(EC.alert_is_present())
        texto = alerta.text
        alerta.accept() # Clica em OK
        return texto