## K8s cluster for jude 0

Run the following commands to install KEDA:

- Add Helm repo
```
helm repo add kedacore https://kedacore.github.io/charts
```

- Update Helm repo
```
helm repo update
```

- Install keda Helm chart
```
helm install keda kedacore/keda --namespace keda --create-namespace
```

# run the following commands

```
cd apps/k8s
```

```
kubectl apply -f configmap.yml
```

```
kubectl apply -f secret.yml
```

```
kubectl apply -f database.yml
```

```
kubectl apply -f jude0Server.yml
```

```
kubectl apply -f redis.yml
```

```
kubectl apply -f workers.yml
```