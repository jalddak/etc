import node_class

class BTree:
    def __init__(self, root=None, m=5):
        self.root = root
        self.m = m

    # search
    def search(self, root, key):
        kv = None
        # 이건 트리의 root 부분에서밖에 활용이 안되겠다.
        if root is None:
            kv = None
        else:
            index = 0
            while index < len(root.kvs):
                if root.kvs[index].key == key:
                    kv = root.kvs[index]
                    break
                elif root.kvs[index].key > key:
                    # 리프노드가 아니라면 더 들어갈 수 있지만, 리프노드라면 root.childnodes[index]에서 index오류남
                    if not root.isLeaf:
                        kv = self.search(root.childnodes[index], key)
                    break
                index += 1
                if index == len(root.kvs):
                    if not root.isLeaf:
                        kv = self.search(root.childnodes[index], key)
        return kv

    # insert
    def insert(self, root, kv):
        # 루트노드가 없을 때
        if root is None:
            node = node_class.Node()
            node.kvs.append(kv)
            node.isRoot = True
            root = node
            return root
        # 리프노드까지 내려갔을 때
        elif root.isLeaf:
            root.kvs.append(kv)
            root.sort()
            left = None
            right = None
            # 만약 노드에 키값이 차수만큼 꽉 찼다면
            if len(root.kvs) == self.m:
                index = 0
                left = node_class.Node()
                right = node_class.Node()
                # 홀수 차수로 만들었으니까 가운데 기준으로 반갈죽한다.
                while index < self.m//2:
                    left.kvs.append(root.kvs[index])
                    right.kvs.append(root.kvs[index+(self.m//2)+1])
                    index += 1
                # 근데 이게 루트노드가 아니라면 이 모든 값을 부모노드로 데리고가서 요리한다.
                if not root.isRoot:
                    return root, left, right, root.kvs[self.m//2]
                # 근데 이게 루트노드라면 루트노드 위에 하나만들고 아래에 자식노드 두개 만드는 것이다.
                else:
                    middle = root.kvs[self.m//2]
                    node = node_class.Node()
                    node.isRoot = True
                    node.isLeaf = False
                    root = node
                    root.kvs.append(middle)
                    root.childnodes.append(left)
                    root.childnodes.append(right)
                    return root
            if not root.isRoot:
                return root, left, right, root.kvs[self.m // 2]
            else:
                return root
        # 리프노드가 아니라서 더 내려가야 할 때
        elif not root.isLeaf:
            index = 0
            left = None
            right = None
            middle = None
            # 일단 현재 노드에 있는 키갯수만큼 반복문 돌려서 들어가야할 구멍 찾기
            while index < len(root.kvs):
                # 현재 갖고있는 키값보다 큰놈이다? 바로 들어가버리기
                if root.kvs[index].key > kv.key:
                    node, left, right, middle = self.insert(root.childnodes[index], kv)
                    # 자식 노드 요리된거 봤는데 자식노드가 꽉차버린놈이다? 바로 반갈죽된 재료값 알맞게 넣는다.
                    if len(node.kvs) == self.m:
                        root.childnodes[index] = left
                        root.childnodes.insert(index+1, right)
                        root.kvs.insert(index, middle)
                        # 근데 이 반갈죽되서 가운데값 올라온놈 때문에 현재 노드도 꽉차버렸다? 바로 반갈죽
                        if len(root.kvs) == self.m:
                            index2 = 0
                            left = node_class.Node()
                            right = node_class.Node()
                            # 어? 이거 리프노드에서 본 코드랑 비슷한데 왜 머가 더 써있지?
                            # 걔는 리프노드라 자식노드가 없고 얘는 리프노드가 아니라 자식노드도 알고가야해서
                            while index2 < self.m // 2:
                                left.kvs.append(root.kvs[index2])
                                left.childnodes.append(root.childnodes[index2])
                                right.kvs.append(root.kvs[index2 + (self.m // 2) + 1])
                                right.childnodes.append(root.childnodes[index2 + (self.m // 2) + 1])
                                index2 += 1
                            left.childnodes.append(root.childnodes[index2])
                            right.childnodes.append(root.childnodes[index2 + (self.m // 2) + 1])
                            left.isLeaf = False
                            right.isLeaf = False
                            if not root.isRoot:
                                return root, left, right, root.kvs[self.m // 2]
                            else:
                                middle = root.kvs[self.m // 2]
                                node = node_class.Node()
                                node.isRoot = True
                                node.isLeaf = False
                                root = node
                                root.kvs.append(middle)
                                root.childnodes.append(left)
                                root.childnodes.append(right)
                                return root
                        if not root.isRoot:
                            return root, left, right, middle
                        else:
                            return root
                    # 자식노드 꽉 안찬놈이면 위에도 다 변화가 없겠구나
                    else:
                        root.childnodes[index] = node
                        if not root.isRoot:
                            return root, left, right, middle
                        else:
                            return root
                index += 1
                # 맨 끝에 자식노드로 들어가야 할 경우
                if index == len(root.kvs):
                    node, left, right, middle = self.insert(root.childnodes[index], kv)
                    # 자식 노드 요리된거 봤는데 자식노드가 꽉차버린놈이다? 바로 반갈죽된 재료값 알맞게 넣는다.
                    if len(node.kvs) == self.m:
                        root.childnodes[index] = left
                        root.childnodes.insert(index + 1, right)
                        root.kvs.insert(index, middle)
                        # 근데 이 반갈죽되서 가운데값 올라온놈 때문에 현재 노드도 꽉차버렸다? 바로 반갈죽
                        if len(root.kvs) == self.m:
                            index2 = 0
                            left = node_class.Node()
                            right = node_class.Node()
                            # 어? 이거 리프노드에서 본 코드랑 비슷한데 왜 머가 더 써있지?
                            # 걔는 리프노드라 자식노드가 없고 얘는 리프노드가 아니라 자식노드도 알고가야해서
                            while index2 < self.m // 2:
                                left.kvs.append(root.kvs[index2])
                                left.childnodes.append(root.childnodes[index2])
                                right.kvs.append(root.kvs[index2 + (self.m // 2) + 1])
                                right.childnodes.append(root.childnodes[index2 + (self.m // 2) + 1])
                                index2 += 1
                            left.childnodes.append(root.childnodes[index2])
                            right.childnodes.append(root.childnodes[index2 + (self.m // 2) + 1])
                            left.isLeaf = False
                            right.isLeaf = False
                            if not root.isRoot:
                                return root, left, right, root.kvs[self.m // 2]
                            else:
                                middle = root.kvs[self.m // 2]
                                node = node_class.Node()
                                node.isRoot = True
                                node.isLeaf = False
                                root = node
                                root.kvs.append(middle)
                                root.childnodes.append(left)
                                root.childnodes.append(right)
                                return root
                        if not root.isRoot:
                            return root, left, right, middle
                        else:
                            return root
                    # 자식노드 꽉 안찬놈이면 위에도 다 변화가 없겠구나
                    else:
                        root.childnodes[index] = node
                        if not root.isRoot:
                            return root, left, right, middle
                        else:
                            return root

    # delete
    def delete(self, root, key):
        # 자식노드가 현재 키가 최소키가 되는지 안되는지 알기위해
        lack_key = False
        # 변화가 있는 부분이 리프노드인지 아닌지 알기위해/ 리프노드라면 그 아래 차일드노드에 관해서는 생각 x / 리프노드아니라면 생각 o
        leaf_key = False

        # 이건 트리의 root 부분에서밖에 활용이 안되겠다.
        if root is None:
            return root
        else:
            index = 0
            while index < len(root.kvs):
                # 찾았다!
                if root.kvs[index].key == key:
                    # 리프노드인지 아닌지 확인해보자
                    if root.isLeaf:
                        # 리프노드에서도 루트노드인지 아닌지 확인해보자
                        if root.isRoot:
                            root.kvs.pop(index)
                            # 만약 루트노드가 다 비워졌다면 root None으로 해주자
                            if len(root.kvs) == 0:
                                root = None
                            return root
                        # 루트노드가 아니라면
                        else:
                            if len(root.kvs) == self.m//2:
                                lack_key = True
                                leaf_key = True
                            root.kvs.pop(index)
                            return root, lack_key, leaf_key
                    # 리프노드가 아니라면
                    else:
                        kv = self.inorder_predecessor(root.childnodes[index])
                        key = root.kvs[index].key
                        if root.isRoot:
                            root = self.delete(root, kv.key)
                            root = self.search_change(root, key, kv)
                            return root
                        else:
                            root, lack_key, leaf_key = self.delete(root, kv.key)
                            root = self.search_change(root, key, kv)
                            return root, lack_key, leaf_key

                elif root.kvs[index].key > key:
                    # 리프노드가 아니라면 더 들어갈 수 있지만, 리프노드라면 root.childnodes[index]에서 index오류남
                    if not root.isLeaf:
                        root.childnodes[index], lack_key, leaf_key = self.delete(root.childnodes[index], key)
                        # 자식노드가 키못찾았으면(or걍 알잘딱했으면) 걍 올라가
                        if not lack_key:
                            if root.isRoot:
                                return root
                            else:
                                return root, lack_key, leaf_key
                        else:
                            # 자식노드야 너 뭐 부족하니?
                            spare_left = False
                            spare_right = False
                            # 근데 찾은 키가 지금 자식노드중에 가장 왼쪽에 있던 놈이니 아니니?
                            # 아니라면 왼쪽 형제 노드 쪽 key가 최소 개수인지 아닌지 확인해봐
                            if index != 0:
                                root.childnodes[index - 1], spare_left, left_big = self.check_left(root.childnodes[index-1])
                                # 만약 왼쪽 형제 노드가 여유있다면 부모노드 키가 리프노드 키로 들어가고 왼쪽 노드키가 부모노드 키댐
                                if spare_left:
                                    parent_key = root.kvs[index-1]
                                    root.childnodes[index].kvs.insert(0, parent_key)
                                    root.kvs[index-1] = left_big
                                    # 리프노드단에서 부족하면 그 아래 자식노드 신경쓸필요없는데 아니라면 신경써줘야한다.
                                    if not leaf_key:
                                        # left big 's right childnode
                                        lbrc = root.childnodes[index-1].childnodes.pop()
                                        root.childnodes[index].childnodes.insert(0, lbrc)
                                    if root.isRoot:
                                        return root
                                    else:
                                        lack_key = False
                                        leaf_key = False
                                        return root, lack_key, leaf_key
                            # 왼쪽 여유 없으면 오른쪽 여유있는지 확인해봐 근데 찾은 키가 가장 오른쪽 놈이면 하지마
                            if index != len(root.kvs) and not spare_left:
                                root.childnodes[index + 1], spare_right, right_small = self.check_right(root.childnodes[index+1])
                                if spare_right:
                                    parent_key = root.kvs[index]
                                    root.childnodes[index].kvs.append(parent_key)
                                    root.kvs[index] = right_small
                                    if not leaf_key:
                                        # right small 's left childnode
                                        rslc = root.childnodes[index+1].childnodes.pop(0)
                                        root.childnodes[index].childnodes.append(rslc)
                                    if root.isRoot:
                                        return root
                                    else:
                                        lack_key = False
                                        leaf_key = False
                                        return root, lack_key, leaf_key
                            # 왼쪽 오른쪽 둘다 여유없으면 부모노드인 현재노드가 여유 있나 확인해봐
                            if not spare_left and not spare_right:
                                # 여유가 있다면
                                if len(root.kvs) > self.m//2:
                                    # 일단 index 같은 부모 노드 키를 내리는 쪽으로 하는데 맨오른쪽은 인덱스 다를거니까 그거 유의
                                    if index != len(root.kvs):
                                        parent_key = root.kvs.pop(index)
                                        root.childnodes[index + 1].kvs.insert(0, parent_key)
                                        for kv in root.childnodes[index + 1].kvs:
                                            root.childnodes[index].kvs.append(kv)
                                        if not leaf_key:
                                            for childnode in root.childnodes[index + 1].childnodes:
                                                root.childnodes[index].childnodes.append(childnode)
                                        root.childnodes.pop(index+1)
                                        if root.isRoot:
                                            return root
                                        else:
                                            lack_key = False
                                            leaf_key = False
                                            return root, lack_key, leaf_key
                                    else:
                                        parent_key = root.kvs.pop(index-1)
                                        root.childnodes[index - 1].kvs.append(parent_key)
                                        for kv in root.childnodes[index].kvs:
                                            root.childnodes[index-1].kvs.append(kv)
                                        if not leaf_key:
                                            for childnode in root.childnodes[index].childnodes:
                                                root.childnodes[index-1].childnodes.append(childnode)
                                        root.childnodes.pop(index)
                                        if root.isRoot:
                                            return root
                                        else:
                                            lack_key = False
                                            leaf_key = False
                                            return root, lack_key, leaf_key
                                # 여유가 없다면
                                else:
                                    # 일단 index 같은 부모 노드 키를 내리는 쪽으로 하는데 맨오른쪽은 인덱스 다를거니까 그거 유의
                                    if index != len(root.kvs):
                                        parent_key = root.kvs.pop(index)
                                        root.childnodes[index + 1].kvs.insert(0, parent_key)
                                        for kv in root.childnodes[index + 1].kvs:
                                            root.childnodes[index].kvs.append(kv)
                                        if not leaf_key:
                                            for childnode in root.childnodes[index + 1].childnodes:
                                                root.childnodes[index].childnodes.append(childnode)
                                        root.childnodes.pop(index + 1)
                                        if root.isRoot:
                                            # 만약 루트에 키값이 다 비워져버렸다면 즉 루트가 한개남았을때 그게 자식으로 갔다면
                                            if len(root.kvs) == 0:
                                                root.childnodes[index].isRoot = True
                                                root = root.childnodes[index]
                                            return root
                                        else:
                                            lack_key = True
                                            leaf_key = False
                                            return root, lack_key, leaf_key
                                    else:
                                        parent_key = root.kvs.pop(index - 1)
                                        root.childnodes[index - 1].kvs.append(parent_key)
                                        for kv in root.childnodes[index].kvs:
                                            root.childnodes[index - 1].kvs.append(kv)
                                        if not leaf_key:
                                            for childnode in root.childnodes[index].childnodes:
                                                root.childnodes[index - 1].childnodes.append(childnode)
                                        root.childnodes.pop(index)
                                        if root.isRoot:
                                            # 만약 루트에 키값이 다 비워져버렸다면 즉 루트가 한개남았을때 그게 자식으로 갔다면
                                            if len(root.kvs) == 0:
                                                root.childnodes[index-1].isRoot = True
                                                root = root.childnodes[index-1]
                                            return root
                                        else:
                                            lack_key = True
                                            leaf_key = False
                                            return root, lack_key, leaf_key
                    else:
                        if root.isRoot:
                            return root
                        else:
                            return root, lack_key, leaf_key
                index += 1
                if index == len(root.kvs):
                    # 리프노드가 아니라면 더 들어갈 수 있지만, 리프노드라면 root.childnodes[index]에서 index오류남
                    if not root.isLeaf:
                        root.childnodes[index], lack_key, leaf_key = self.delete(root.childnodes[index], key)
                        # 자식노드가 키못찾았으면(or걍 알잘딱했으면) 걍 올라가
                        if not lack_key:
                            if root.isRoot:
                                return root
                            else:
                                return root, lack_key, leaf_key
                        else:
                            # 자식노드야 너 뭐 부족하니?
                            spare_left = False
                            spare_right = False
                            # 근데 찾은 키가 지금 자식노드중에 가장 왼쪽에 있던 놈이니 아니니?
                            # 아니라면 왼쪽 형제 노드 쪽 key가 최소 개수인지 아닌지 확인해봐
                            if index != 0:
                                root.childnodes[index - 1], spare_left, left_big = self.check_left(
                                    root.childnodes[index - 1])
                                # 만약 왼쪽 형제 노드가 여유있다면 부모노드 키가 리프노드 키로 들어가고 왼쪽 노드키가 부모노드 키댐
                                if spare_left:
                                    parent_key = root.kvs[index - 1]
                                    root.childnodes[index].kvs.insert(0, parent_key)
                                    root.kvs[index - 1] = left_big
                                    # 리프노드단에서 부족하면 그 아래 자식노드 신경쓸필요없는데 아니라면 신경써줘야한다.
                                    if not leaf_key:
                                        # left big 's right childnode
                                        lbrc = root.childnodes[index - 1].childnodes.pop()
                                        root.childnodes[index].childnodes.insert(0, lbrc)
                                    if root.isRoot:
                                        return root
                                    else:
                                        lack_key = False
                                        leaf_key = False
                                        return root, lack_key, leaf_key
                            # 왼쪽 여유 없으면 오른쪽 여유있는지 확인해봐 근데 찾은 키가 가장 오른쪽 놈이면 하지마
                            if index != len(root.kvs) and not spare_left:
                                root.childnodes[index + 1], spare_right, right_small = self.check_right(
                                    root.childnodes[index + 1])
                                if spare_right:
                                    parent_key = root.kvs[index]
                                    root.childnodes[index].kvs.append(parent_key)
                                    root.kvs[index] = right_small
                                    if not leaf_key:
                                        # right small 's left childnode
                                        rslc = root.childnodes[index + 1].childnodes.pop(0)
                                        root.childnodes[index].childnodes.append(rslc)
                                    if root.isRoot:
                                        return root
                                    else:
                                        lack_key = False
                                        leaf_key = False
                                        return root, lack_key, leaf_key
                            # 왼쪽 오른쪽 둘다 여유없으면 부모노드인 현재노드가 여유 있나 확인해봐
                            if not spare_left and not spare_right:
                                # 여유가 있다면
                                if len(root.kvs) > self.m // 2:
                                    # 일단 index 같은 부모 노드 키를 내리는 쪽으로 하는데 맨오른쪽은 인덱스 다를거니까 그거 유의
                                    if index != len(root.kvs):
                                        parent_key = root.kvs.pop(index)
                                        root.childnodes[index + 1].kvs.insert(0, parent_key)
                                        for kv in root.childnodes[index + 1].kvs:
                                            root.childnodes[index].kvs.append(kv)
                                        if not leaf_key:
                                            for childnode in root.childnodes[index + 1].childnodes:
                                                root.childnodes[index].childnodes.append(childnode)
                                        root.childnodes.pop(index + 1)
                                        if root.isRoot:
                                            return root
                                        else:
                                            lack_key = False
                                            leaf_key = False
                                            return root, lack_key, leaf_key
                                    else:
                                        parent_key = root.kvs.pop(index - 1)
                                        root.childnodes[index - 1].kvs.append(parent_key)
                                        for kv in root.childnodes[index].kvs:
                                            root.childnodes[index - 1].kvs.append(kv)
                                        if not leaf_key:
                                            for childnode in root.childnodes[index].childnodes:
                                                root.childnodes[index - 1].childnodes.append(childnode)
                                        root.childnodes.pop(index)
                                        if root.isRoot:
                                            return root
                                        else:
                                            lack_key = False
                                            leaf_key = False
                                            return root, lack_key, leaf_key
                                # 여유가 없다면
                                else:
                                    # 일단 index 같은 부모 노드 키를 내리는 쪽으로 하는데 맨오른쪽은 인덱스 다를거니까 그거 유의
                                    if index != len(root.kvs):
                                        parent_key = root.kvs.pop(index)
                                        root.childnodes[index + 1].kvs.insert(0, parent_key)
                                        for kv in root.childnodes[index + 1].kvs:
                                            root.childnodes[index].kvs.append(kv)
                                        if not leaf_key:
                                            for childnode in root.childnodes[index + 1].childnodes:
                                                root.childnodes[index].childnodes.append(childnode)
                                        root.childnodes.pop(index + 1)
                                        if root.isRoot:
                                            # 만약 루트에 키값이 다 비워져버렸다면 즉 루트가 한개남았을때 그게 자식으로 갔다면
                                            if len(root.kvs) == 0:
                                                root.childnodes[index].isRoot = True
                                                root = root.childnodes[index]
                                            return root
                                        else:
                                            lack_key = True
                                            leaf_key = False
                                            return root, lack_key, leaf_key
                                    else:
                                        parent_key = root.kvs.pop(index - 1)
                                        root.childnodes[index - 1].kvs.append(parent_key)
                                        for kv in root.childnodes[index].kvs:
                                            root.childnodes[index - 1].kvs.append(kv)
                                        if not leaf_key:
                                            for childnode in root.childnodes[index].childnodes:
                                                root.childnodes[index - 1].childnodes.append(childnode)
                                        root.childnodes.pop(index)
                                        if root.isRoot:
                                            # 만약 루트에 키값이 다 비워져버렸다면 즉 루트가 한개남았을때 그게 자식으로 갔다면
                                            if len(root.kvs) == 0:
                                                root.childnodes[index - 1].isRoot = True
                                                root = root.childnodes[index - 1]
                                            return root
                                        else:
                                            lack_key = True
                                            leaf_key = False
                                            return root, lack_key, leaf_key
                    else:
                        if root.isRoot:
                            return root
                        else:
                            return root, lack_key, leaf_key

    # 왼쪽 형제노드가 충분한지, 가장 큰 키값은 뭔지 확인하기 위함
    def check_left(self, node):
        spare_left = False
        left_big = None
        nok = len(node.kvs)
        if nok > self.m//2:
            spare_left = True
            # 스페어 확정나면 어차피 지워질 놈 미리지운다
            left_big = node.kvs.pop()
        return node, spare_left, left_big

    # 오른쪽 형제노드가 충분한지, 가장 작은 키값은 뭔지 확인하기 위함
    def check_right(self, node):
        spare_right = False
        right_small = None
        nok = len(node.kvs)
        if nok > self.m // 2:
            spare_right = True
            # 스페어 확정나면 어차피 지워질 놈 미리지운다
            right_small = node.kvs.pop(0)
        return node, spare_right, right_small

    # 키를 찾았는데 리프노드가 아니라 내부 노드면 찾은 키 값과 바꿔줄 왼쪽 서브트리에서 가장 큰 값을 찾기 위해
    def inorder_predecessor(self, node):
        if node.isLeaf:
            kv = node.kvs[len(node.kvs)-1]
        else:
            node = node.childnodes[len(node.childnodes)-1]
            kv = self.inorder_predecessor(node)
        return kv
    
    # 중간 노드에서 왼쪽 서브트리의 가장 큰 값과 바꾸고 나서 그 값을 삭제하고나서 다시 키값의 위치를 찾기위한 서치트리
    def search_change(self, root, key, kv):
        # 이건 트리의 root 부분에서밖에 활용이 안되겠다.
        if root is None:
            return root
        else:
            index = 0
            while index < len(root.kvs):
                if root.kvs[index].key == key:
                    root.kvs[index] = kv
                    break
                elif root.kvs[index].key > key:
                    # 리프노드가 아니라면 더 들어갈 수 있지만, 리프노드라면 root.childnodes[index]에서 index오류남
                    if not root.isLeaf:
                        root.childnodes[index] = self.search_change(root.childnodes[index], key, kv)
                    break
                index += 1
                if index == len(root.kvs):
                    if not root.isLeaf:
                        root.childnodes[index] = self.search_change(root.childnodes[index], key, kv)
        return root