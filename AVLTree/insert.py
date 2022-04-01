import node_class
import avltree_class
import csv


# 딜리트할때 그러면 어떻게 트리를 유지할수있을까? 전역변수? 아니면 메인에서 avltree를 줘야할까?
# -- 메인에서 avltree 만들고 insertFile 함수에서 return 값으로 avltree를 메인에 넘겨줌. 메인에서 delete할 때 가져오면 될 듯.

def insertFile(fileName):
    # 트리 만드는 과정
    try:
        input = open('./data/' + fileName, 'r', encoding='utf-8')
    except FileNotFoundError:
        print("*** 없는 파일 입니다. ***\n")
        return None, None
    rdr = csv.reader(input, delimiter='\t')
    avltree = avltree_class.AVLTree()
    print("--- 트리 만드는 중 ---")
    keyList = [] # 나중에 모든 키를 search 해야해서 키는 따로 알아둬야함.
    for line in rdr:
        node = node_class.Node(int(line[0]), line[1])
        avltree.root = avltree.insert(avltree.root, node)
        keyList.append(int(line[0]))
    input.close()
    print("--- 트리 완성 ---")

    # 만든 트리로 input 파일이랑 똑같은 파일 만들기 (search 하면서 파일만들기)
    output = open("./data/insertion.csv", 'w', encoding='utf-8')
    print("--- insertion.csv 만드는 중 ---")
    for key in keyList:
        node = avltree.search(avltree.root, key)
        if node is None:
            output.write(str(key) + '\tN/A\n')
        else:
            output.write(str(node.key) + '\t' + node.value + '\n')
    output.close()
    print("--- insertion.csv 완성 ---")

    # insertion.csv 파일과 input 파일을 비교하여 제대로 복사했는지 비교하기.
    input = open('./data/' + fileName, 'r', encoding='utf-8')
    insertion = open("./data/insertion.csv", 'r', encoding='utf-8')
    print("--- input 파일과 만들어진 insertion.csv 이 같은지 비교하는 중 ---")
    rdr = csv.reader(input, delimiter='\t')
    rdr2 = csv.reader(insertion, delimiter='\t')
    inputList = []
    insertionList = []
    for line in rdr:
        inputList.append(line)
    for line in rdr2:
        insertionList.append(line)
    if len(inputList) < len(insertionList):
        print("--- insertion.csv 파일에 무언가 더 작성되었습니다. ---")
    elif len(inputList) > len(insertionList):
        print("--- input 파일에 무언가 더 작성되었습니다. ---")
    else:
        error = 0
        i = 0
        for list in inputList:
            if inputList[i] != insertionList[i]:
                print("*** " + inputList[i][0] + " 키 값에서 트리를 제대로 만들지 못했습니다. ***")
                error += 1
            i += 1
        if error == 0:
            print("--- 오류가 발견되지 않았습니다. 완벽히 일치합니다. ---")
        else:
            print("--- %d개의 키 값에서 오류가 있었습니다. ---" % error)
    print()
    input.close()
    insertion.close()

    return avltree, keyList