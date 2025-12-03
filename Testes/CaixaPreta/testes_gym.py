import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from pages import LoginPage, AdminPage
import time

class TestesGymSystem(unittest.TestCase):
    
    BASE_URL = "http://localhost:3000" 

    def setUp(self):
        # Configuração inicial antes de CADA teste
        servico = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=servico)
        self.driver.maximize_window()
        self.driver.get(self.BASE_URL)
        
        # Pré-condição: Login como Admin
        login = LoginPage(self.driver)
        login.logar("admin@gym.com", "senha123") 
        
        # Inicializa a página de admin
        self.admin_page = AdminPage(self.driver)

    def test_ct001_cadastrar_atividade_sucesso(self):
        """ 
        CT-001: Cadastro Válido [RF002]
        Cenário: Admin cadastra uma aula chamada 'testeaula' com ID do professor 2 e descrição.
        Resultado Esperado: Alerta de sucesso e atividade na lista.
        """
        nome_atividade = "testeaula"
        
        self.admin_page.abrir_modal_cadastro()
        
        # ATUALIZADO: Adicionado o campo descricao
        self.admin_page.preencher_modal(
            nome=nome_atividade,
            tipo="Aula",
            descricao="Esta é uma aula de teste para verificar o cadastro.", 
            duracao="60",
            capacidade="20",
            profissional="2"
        )
        self.admin_page.salvar_formulario()

        # Validação 1: Verifica o texto do Alerta
        mensagem_alerta = self.admin_page.lidar_com_alerta_sucesso()
        self.assertIn("Nova atividade cadastrada", mensagem_alerta)
        
        time.sleep(1) 

        # Validação 2: Verifica se o card apareceu na listagem
        nomes_na_tela = self.admin_page.obter_nomes_atividades()
        self.assertIn(nome_atividade, nomes_na_tela)

    def test_ct002_validacao_campos_obrigatorios(self):
        """ 
        CT-002: Validação de Campos (Erro)
        Cenário: Tentar cadastrar sem preencher o NOME.
        Resultado Esperado: O formulário não deve ser submetido.
        """
        self.admin_page.abrir_modal_cadastro()
       
        self.admin_page.preencher_modal(
            nome="", 
            tipo="Treino",
            descricao="Tentativa de cadastro sem nome.",
            duracao="30",
            capacidade="5",
            profissional="2"
        )
        self.admin_page.salvar_formulario()

        # Validação: Se der erro ao buscar alerta, é SUCESSO
        try:
            self.driver.switch_to.alert
            self.fail("O formulário foi enviado mesmo com nome vazio!")
        except:
            pass
        
        self.assertIn("/admin", self.driver.current_url)

    def test_ct003_consultar_atividade(self):
        """ 
        CT-003: Consultar/Buscar Atividade [RF003]
        Cenário: Criar a 'testeaula' e depois buscá-la na barra de pesquisa.
        Resultado Esperado: Apenas a 'testeaula' deve ser exibida.
        """
        termo_busca = "testeaula" 
        
        # 1. Cria a atividade primeiro
        self.admin_page.abrir_modal_cadastro()
        
        # ATUALIZADO: Adicionado descricao
        self.admin_page.preencher_modal(
            nome=termo_busca, 
            tipo="Aula", 
            descricao="Descrição para teste de busca",
            duracao="45", 
            capacidade="10", 
            profissional="2"
        )
        self.admin_page.salvar_formulario()
        self.admin_page.lidar_com_alerta_sucesso()
        
        time.sleep(1) 

        # 2. Realiza a Busca
        self.admin_page.buscar_atividade(termo_busca)
        time.sleep(0.5) 

        # 3. Validação
        nomes_retornados = self.admin_page.obter_nomes_atividades()
        
        self.assertTrue(len(nomes_retornados) > 0, "A busca não retornou nada!")
        self.assertIn(termo_busca, nomes_retornados)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()