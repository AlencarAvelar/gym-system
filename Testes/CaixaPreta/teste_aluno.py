import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options  # Importante importar Options
from webdriver_manager.chrome import ChromeDriverManager
from pages import LoginPage, StudentPage
import time

class TestesAluno(unittest.TestCase):
    
    BASE_URL = "http://localhost:3000" 

    def setUp(self):
        servico = Service(ChromeDriverManager().install())
        
        options = Options()
        
        # --- BLOCO DE PREFS (Preferências do Perfil) ---
        prefs = {
            "credentials_enable_service": False,
            "profile.password_manager_enabled": False,
            "profile.password_manager_leak_detection": False, #chave para o alerta de vazamento
            "safebrowsing.enabled": False,
            "safebrowsing.disable_download_protection": True,
            "profile.default_content_setting_values.notifications": 2 # Bloqueia notificações
        }
        options.add_experimental_option("prefs", prefs)

        # --- ARGUMENTOS DE INICIALIZAÇÃO ---
        # Desativa especificamente a feature de detecção de vazamento
        options.add_argument("--disable-features=PasswordLeakDetection")
        options.add_argument("--disable-save-password-bubble")
        options.add_argument("--disable-notifications")
        options.add_argument("--no-default-browser-check")
        
        # Ignora erros de certificado (ajuda em localhost)
        options.add_argument("--ignore-certificate-errors")

        self.driver = webdriver.Chrome(service=servico, options=options)
        self.driver.maximize_window()
        self.driver.get(self.BASE_URL)
        
        # 1. Login como Aluno
        login = LoginPage(self.driver)
        login.logar("joao@teste.com", "senha123") 
        
        self.student_page = StudentPage(self.driver)

    def test_aluno_agendar_aula(self):
        """ 
        CT-ALUNO-001: Agendamento de Aula com Sucesso
        Cenário: Aluno loga, vai em Agendar Aula, escolhe uma opção e confirma data/hora.
        """
        
        # 1. Clicar no menu "Agendar Aula"
        self.student_page.ir_para_agendar_aula()
        
        # Pequena pausa para garantir transição visual
        time.sleep(1) 

        # 2. Escolher a primeira atividade da lista e clicar em "Agendar"
        self.student_page.clicar_em_agendar_primeira_atividade()
        
        # 3. Preencher o Modal 
        
        data_teste = "12-20-2025"
        hora_teste = "14:30"
        
        self.student_page.preencher_modal_agendamento(data_teste, hora_teste)
        
        # 4. Confirmar
        self.student_page.confirmar_agendamento()

        # 5. Validação: Verifica se exibiu alerta de sucesso
        mensagem = self.student_page.lidar_com_alerta()
        
        if mensagem:
            print(f"Alerta recebido: {mensagem}")
            # Verifica se 'sucesso' ou 'agendado' está na mensagem (ignorando maiúsculas/minúsculas)
            self.assertTrue("sucesso" in mensagem.lower() or "agendado" in mensagem.lower())
        else:
            self.fail("O alerta de confirmação não apareceu.")

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()