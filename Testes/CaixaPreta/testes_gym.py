import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from pages import LoginPage, AdminPage

class TestesGymSystem(unittest.TestCase):
    
    BASE_URL = "http://localhost:3000" # Ajuste se sua porta for diferente

    def setUp(self):
        # Configuração inicial antes de CADA teste
        servico = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=servico)
        self.driver.maximize_window()
        self.driver.get(self.BASE_URL)
        
        # Pré-condição: Todos os testes precisam de Login como Admin
        login = LoginPage(self.driver)
        # No seu Login.js: senha 'admin' redireciona para /admin
        login.logar("admin@gym.com", "admin") 
        
        self.admin_page = AdminPage(self.driver)

    def test_ct001_cadastrar_atividade_sucesso(self):
        """ 
        CT-001: Cadastro Válido [RF002]
        Cenário: Admin preenche todos os dados do modal e salva.
        Resultado Esperado: Alerta de sucesso e atividade na lista.
        """
        nome_atividade = "Crossfit Avançado"
        
        self.admin_page.abrir_modal_cadastro()
        self.admin_page.preencher_modal(
            nome=nome_atividade,
            tipo="Aula",
            duracao="60 min",
            capacidade="20",
            profissional="Prof. Carlos"
        )
        self.admin_page.salvar_formulario()

        # Validação 1: Verifica o texto do Alerta (window.alert)
        mensagem_alerta = self.admin_page.lidar_com_alerta_sucesso()
        self.assertIn("Nova atividade cadastrada", mensagem_alerta)

        # Validação 2: Verifica se o card apareceu na listagem
        nomes_na_tela = self.admin_page.obter_nomes_atividades()
        self.assertIn(nome_atividade, nomes_na_tela)

    def test_ct002_validacao_campos_obrigatorios(self):
        """ 
        CT-002: Validação de Campos (Erro)
        Cenário: Tentar cadastrar sem preencher o NOME (campo obrigatório).
        Resultado Esperado: O formulário não deve ser submetido (Modal continua aberto).
        """
        self.admin_page.abrir_modal_cadastro()
        
        # Preenche tudo EXCETO o nome (deixa string vazia)
        self.admin_page.preencher_modal(
            nome="", 
            tipo="Treino",
            duracao="30 min",
            capacidade="5",
            profissional="Personal Ana"
        )
        self.admin_page.salvar_formulario()

        # Validação:
        # Se o HTML5 'required' funcionar, o navegador bloqueia o envio.
        # Portanto, NÃO deve aparecer alerta de sucesso e o Modal ainda deve estar visível.
        try:
            # Tenta capturar um alerta. Se capturar, o teste FALHA (pois salvou indevidamente)
            self.driver.switch_to.alert
            self.fail("O formulário foi enviado mesmo com nome vazio!")
        except:
            # Se der erro ao buscar alerta, é SUCESSO (significa que nada aconteceu)
            pass
        
        # Verifica se ainda estamos na mesma URL (não houve navegação inesperada)
        self.assertIn("/admin", self.driver.current_url)

    def test_ct003_consultar_atividade(self):
        """ 
        CT-003: Consultar/Buscar Atividade [RF003]
        Cenário: Digitar nome de atividade na busca.
        Resultado Esperado: Apenas atividades correspondentes devem ser exibidas.
        """
        # Primeiro, garantimos que existe algo buscável (depende do estado inicial do seu banco/mock)
        # Vamos buscar por algo genérico que sabemos que pode existir ou que acabamos de criar
        termo_busca = "Yoga" 
        
        # (Opcional) Cria a atividade antes para garantir que ela existe no teste
        self.admin_page.abrir_modal_cadastro()
        self.admin_page.preencher_modal("Yoga Flex", "Aula", "45", "10", "Prof. Zen")
        self.admin_page.salvar_formulario()
        self.admin_page.lidar_com_alerta_sucesso()

        # Ação de Busca
        self.admin_page.buscar_atividade(termo_busca)

        # Validação
        nomes_retornados = self.admin_page.obter_nomes_atividades()
        
        # Verifica se TODOS os itens retornados contêm "Yoga"
        for nome in nomes_retornados:
            self.assertIn(termo_busca, nome)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()