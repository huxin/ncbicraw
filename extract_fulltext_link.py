import os
import sys
from bs4 import BeautifulSoup

inf = 'rawhtml.txt'
if len(sys.argv) > 1:
    inf = sys.argv[1]
    exit(1)

page = ''
for l in open(inf):
    if l.find('XXXX-------------MMMM') != -1:
        # load with beautifulsoup
        soup = BeautifulSoup(page, 'lxml')
        print soup
        res = soup.find_all('div', class_="icons portlet")
        print res
        pass
        exit(1)

    else:
        page += l