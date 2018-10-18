import os
import requests
from fn import F
from operator import *
import json
from pathlib import Path


STATIC_ASSETS = Path(os.path.join(os.path.dirname(__file__), '../', 'static_assets'))

@F
def fetch_interface(avid):
    base_uri = 'https://api.bilibili.com/x/web-interface/view?aid={}'.format(avid)
    return requests.get(base_uri).json()


def interprect_image(img):
    path = STATIC_ASSETS / 'img' / 'recommand' / img.split('/')[-1]
    with open(path, 'wb') as f:
        f.write(requests.get(img).content)
    return '/static/img/recommand/' + path.name

def get_infos(js):
    return {
        'title': js['title'],
        'up': js['owner']['name'],
        'img': interprect_image(js['pic'])
    }

fetch_info = fetch_interface >> itemgetter('data') >> get_infos
glb_cache = {}
def fetch_chain(aid):
    if aid not in glb_cache:
        glb_cache[aid] = dict(fetch_info(aid), aid=aid)
    return glb_cache[aid]

class RecommandManager:
    def __init__(self):
        self.play_lists = []
        self.play_list_names = []
    
    def add_playlist(self, mid, cid):
        base_uri = lambda page: f'https://api.bilibili.com/x/space/channel/video?mid={mid}&cid={cid}&pn={page}'
        pn = 1
        total_page = 1
        videos = []
        video_name = ''
        while pn <= total_page:
            resp = requests.get(base_uri(pn)).json()['data']
            total_page = resp['page']['num']
            videos.extend(map(F(itemgetter('aid')) >> str, resp['list']['archives']))
            video_name = resp['list']['name']
            pn += 1
        self.play_lists.append(videos)
        self.play_list_names.append(video_name)
    
    def add_manual_list(self, name, xs):
        self.play_list_names.append(name)
        self.play_lists.append(xs)
    
    def get_js(self):
        return [
            {
                'name': pln,
                'isList': isinstance(pl, list),
                'data': list(map(fetch_chain, pl)) if isinstance(pl, list) else fetch_chain(pl),
                'ups': list(set(map(itemgetter('up'), map(fetch_chain, pl)))) if isinstance(pl, list) else [fetch_chain(pl)['up']]
            } for pln, pl in zip(self.play_list_names, self.play_lists)
        ]

    def write_to_file(self, fn):
        with open(fn, 'w') as f:
            f.write(json.dumps(self.get_js(), indent=2))

if __name__ == '__main__':
    rm = RecommandManager()
    rm.add_manual_list('自我介绍', [
        '32448660', '32617183', '32617192', '32617368', '33468401'
    ])
    rm.add_playlist('99232216', '43662')
    rm.write_to_file(STATIC_ASSETS / 'json' / 'recommandVideos.json')
