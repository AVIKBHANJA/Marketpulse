import json 
import os 

import requests
from langchain.tools import tool

class SearchTools:

    #langchain.tools.tool decorator is used to define a tool, the string inside it is 
    # the name of the tool that will be used to call it in the conversation

    @tool("Search the internet")
    def search_internet(query):
        """
            This tool is useful to search the internet for any query
            and results relevant results
        """
        top_K = 4
        url = "https://google.serper.dev/search"
        payload = json.dumps({"q": query})
        headers = {
            'X-API-KEY': os.getenv("SERPER_API_KEY"),
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        # check if there is an organic key 
        if "organic" in response.json():
            results = response.json()["organic"]
            string = []
            for result in results[:top_K]:
                try:
                    string.append("\n".join([
                        f'Title: {result["title"]}',
                        f'Link: {result["link"]}',
                        f'Snippet: {result["snippet"]}',
                        "\n------------------------"
                    ]))
                except KeyError:
                    pass
        else:
            return "No results found for the query"

    @tool("Search news on the internet")
    def search_news(query):
        """Useful to search news about a company, stock or any other
        topic and return relevant results"""""
        top_result_to_return = 4
        url = "https://google.serper.dev/news"
        payload = json.dumps({"q": query})
        headers = {
            'X-API-KEY': os.environ['SERPER_API_KEY'],
            'content-type': 'application/json'
        }
        response = requests.request("POST", url, headers=headers, data=payload)
        results = response.json()['news']
        string = []
        for result in results[:top_result_to_return]:
          try:
            string.append('\n'.join([
                f"Title: {result['title']}", f"Link: {result['link']}",
                f"Snippet: {result['snippet']}", "\n-----------------"
            ]))
          except KeyError:
            next

        return '\n'.join(string)





