import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from pages import LoginPage, AdminPage 
import time

class TestesProfessor(unittest.TestCase):
    
    BASE_URL = "http://localhost:3000" 

    def setUp(self):
        servico = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=servico)
        self.driver.maximize_window()
        self.driver.get(self.BASE_URL)
        
        # 1. Login como Professor
        login = LoginPage(self.driver)
        login.logar("carlos@gym.com", "senha123") 
        
        self.dashboard = AdminPage(self.driver)

    def test_professor_cadastra_atividade(self):
        """ 
        CT-PROF-001: Cadastro de Atividade pelo Professor
        """
        nome_aula = "Yoga Matinal22"
        
        self.dashboard.abrir_modal_cadastro()
        
        self.dashboard.preencher_modal(
            nome=nome_aula,
            tipo="Aula",
            descricao="Aula de yoga para iniciantes com foco em respiração.", 
            duracao="60",
            capacidade="15"
        )
        
        self.dashboard.salvar_formulario()

        # Validação 1: Alerta de Sucesso
        mensagem = self.dashboard.lidar_com_alerta_sucesso()
        
     
        self.assertIn("cadastrada com sucesso", mensagem)
        
        time.sleep(1) 

        # Validação 2: Verifica se aparece na lista
        nomes_na_tela = self.dashboard.obter_nomes_atividades()
        self.assertIn(nome_aula, nomes_na_tela)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()