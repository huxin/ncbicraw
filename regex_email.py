import os
import sys
import re

# use regex to extract emails from the raw txt
email_regex = re.compile("([ a-zA-Z0-9_.+-]+@[ a-zA-Z0-9-.]+)")

def validemail(e):
    if 'wensenjn' in e:
        return False

    name, domain = e.split('@')
    if len(name) < 2 or len(domain) < 3:
        return False

    if domain.find('.') == -1:
        return False

    if domain.endswith('psu.edu'):
        return False

    bls = ['.png']

    for b in bls:
        if domain.endswith(b):
            return False
    parts = domain.split('.')
    tld = parts[-1]
    if len(tld) > 5:
        return False

    for p in parts:
        if len(p) == 1:
            return False
    return True



# given a line of text returns potential email in it
def get_potential_emails(l):
    ret = []
    for i, c in enumerate(l):
        if c == '@':
            start = max(0, i - 25)
            end = min(i + 25, len(l))
            ret.append(l[start:end])
    return ret


def get_real_emails(potential_emails, rev = False):
    emails = set()
    invalid_emails = set()
    # use regex to find potential matches
    for p in potential_emails:
        match = re.search(email_regex, p)
        if match is not None:
            e = match.group(1)
            if rev:
                # reverse email characters
                e = "".join(list(reversed(e)))

            while e.endswith('.'):
                e = e[:-1]

            e = e.replace(' ', '')

            if validemail(e):
                emails.add(e)
            else:
                invalid_emails.add(e)

    return emails, invalid_emails


def analyze_for_emails(text):
    potential_emails = get_potential_emails(text)
    return get_real_emails(potential_emails)

def analyze_textfile_for_emails(textfile):
    # ignore newline(?)
    content = open(textfile, 'r').read()
    potential_emails = get_potential_emails(content)
    return get_real_emails(potential_emails)

if __name__ == "__main__":

    rawf_name = "fulltextraw/ahmu_ncbi.links.txt.fulltext.link.txt.raw.txt"
    if len(sys.argv) > 1:
        rawf_name = sys.argv[1]

    first = True
    cur_url = ""
    tag = 'XXXXX-START-MMMMM-'


    potential_emails = []
    emailf = open(rawf_name + '.email', 'w')
    invalidemailf = open(rawf_name + '.email.invalid', 'w')
    uniq_emailf = open(rawf_name + '.email.uniq', 'w')
    uniq = set()

    invalid_emails = set()

    analyzed = 0

    for l in open(rawf_name, 'r'):
        if l.startswith(tag):
            # start a new
            if not first:
                # anaylze current url
                #print "Analyzing: ", cur_url, len(potential_emails)
                analyzed += 1
                print "Analyzed", analyzed, "url:", cur_url

                emails, invalids = get_real_emails(potential_emails, cur_url.find('ncbi.nlm.nih.gov') != -1)

                for e in emails:
                    #print e, cur_url
                    print >>emailf, e, cur_url
                    if e not in uniq:
                        uniq.add(e)
                        print >> uniq_emailf, e

            else:
                first = False

            cur_url = l.strip().replace(tag, "")
            potential_emails = []


        else:
            # analyze l and find all potential emails
            potential_emails.extend(get_potential_emails(l))



    #print "\n\nInvalid emails:", "\n".join(invalid_emails)
    print >>invalidemailf, "\n".join(invalid_emails)

    invalidemailf.close()
    emailf.close()
    # Analyzing:  https://bmcophthalmol.biomedcentral.com/articles/10.1186/s12886-017-0470-y 246425
    # 	set(['info@biomedcentral.com', 'lucy02114@163.com', 'huoyong@263.net.cn', 'bmcophthalmol@biomedcentral.com', 'reprints@biomedcentral.com'])
    # Analyzing:  https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5457596/ 143386
    # 	set(['dev@null', 'PMCViewer@4.45', 'moc.621@621uxgnipix', 'moc.621@xxkkydnic', 'nc.moc.liamdem@gnipnaijil', 'moc.qq@693871692', '2FPMCViewer@4.45', 'moc.361@liamenauygnep', 'moc.361@fnujil', 'moc.361@nemegks', 'moc.361@gnawnaynib', 'moc.621@niqamrahp', 'moc.361@ehs', 'moc.621@yfyafroail', 'moc.qq@485691443', 'moc.361@41120ycul', 'moc.anis@gnailahthpo', 'moc.361@uohzgnauguohff', 'moc.anis@gniygnemumjb', 'nc.ten.362@gnoyouh', 'nc.ude.ukp@gniluxnehc', 'moc.361@ufneggnat', 'moc.361@8011yhzrd', 'moc.qq@846883915'])
    # Analyzing:  http://www.sciencedirect.com/science/article/pii/S0006291X17310781 94032
    # 	set(['support@refworks.com', 'zhaojund@126.com', 'dandili@126.com'])
    # Analyzing:  http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0178870 758494
