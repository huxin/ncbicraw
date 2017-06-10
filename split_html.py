import os
import sys
from bs4 import BeautifulSoup

inf = 'rawhtml.txt'
dst_dir = 'htmls'
if len(sys.argv) > 1:
    inf = sys.argv[1]

if len(sys.argv) > 2:
    dst_dir = sys.argv[2]


page = ''
idx = 0
for l in open(inf):
    if l.find('XXXX-------------MMMM') != -1:
        # load with beautifulsoup

        while True:
            html_file = os.path.join(dst_dir, str(idx)+'.html')
            if os.path.exists(html_file) == False:
                break
            idx += 1

        print "writing: ", html_file
        outf = open(html_file, 'w')
        print >>outf, page
        outf.close()
        page = ""


    else:
        page += l