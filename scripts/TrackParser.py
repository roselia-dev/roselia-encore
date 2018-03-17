import re

def match_track(s):
    res = [(int(x), y)
        for x, y in re.findall(r"(\d+)\.(.*)", s)]
    res.sort(key=lambda x:x[0])
    return [i for _, i in res]

def js_array(xs):
    return ", ".join([x.join(['"', '"']) for x in xs]).join(["[", "]"])

def get_lines():
    ls = []
    while True:
        s = input()
        if not s:
            break
        ls.append(s)
    return "\n".join(ls)

def main():
    print(js_array(match_track(get_lines())))

if __name__ == '__main__':
    main()