import os
from textwrap import dedent
from agents import StockAnalysisAgents
from tasks import StockAnalysisTasks
from crewai import Crew
from intents import load_intents, get_response

from dotenv import load_dotenv
load_dotenv()

class StockAnalysisCrew:
    def __init__(self, company, date):
        self.company = company
        self.date = date

    def run(self):
        # Define your custom agents and tasks in agents.py and tasks.py
        agents = StockAnalysisAgents()
        tasks = StockAnalysisTasks()

        # Define your custom agents and tasks here
        financial_analyst = agents.financial_analyst()
        research_analyst = agents.research_analyst()
        investment_advicer = agents.investment_advicer()

        # Custom tasks include agent name and variables as input
        Financial_analysis = tasks.Financial_analysis(
            financial_analyst,
            self.company,
            self.date,
        )

        Research = tasks.Research(
            research_analyst,
            self.company,
            self.date
        )

        Fillings_analysis = tasks.Fillings_analysis(
            research_analyst,
            self.company,
            self.date,
        )

        Recommendation = tasks.Recommendation(
            investment_advicer,
            self.company,
        )

        # Define your custom crew here
        crew = Crew(
            agents=[
                financial_analyst,
                research_analyst, 
                investment_advicer],
            tasks=[
                Financial_analysis,
                Research,
                Fillings_analysis,
                Recommendation],
            verbose=True,
        )

        result = crew.kickoff()
        return result


# This is the main function that you will use to run your custom crew.
if __name__ == "__main__":
    print("########     Welcome to Stock Analysis Crew   ########")
    print("-------------------------------------------------------------")

    intents = load_intents()
    user_query = input("Ask a stock-related question: \n")
    print(get_response(user_query, intents))

    company = input(dedent("""What is the Company that you want to analyze \n"""))
    date = input(dedent("""On what Date you want to buy Stock \n"""))

    custom_crew = StockAnalysisCrew(company, date)
    result = custom_crew.run()
    print("\n\n###########################################################")
    print("### Final Result###\n")
    #print(result)